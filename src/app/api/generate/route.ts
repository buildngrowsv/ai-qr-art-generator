/**
 * /api/generate — QR Art Generation API Endpoint
 *
 * This is the main API endpoint that the dashboard page calls to generate QR art.
 * It orchestrates the full generation flow:
 *   1. Validate request body (URL and style prompt are required)
 *   2. Identify the user (by IP address in v1, by user ID when auth is added)
 *   3. Check rate limit (based on the user's pricing tier)
 *   4. Call fal.ai to generate the QR art
 *   5. Return the generated image URL and remaining generation count
 *
 * SECURITY:
 *   - Rate limiting prevents abuse and enforces tier limits
 *   - Input validation prevents injection and bad API calls
 *   - FAL_KEY is only used server-side (never exposed to client)
 *
 * PERFORMANCE:
 *   - fal.ai generation takes 10-30 seconds (this is expected, not a bug)
 *   - The client shows a loading spinner during this time
 *   - No caching in v1 (every request generates a unique image)
 *
 * CALLED BY: src/app/dashboard/page.tsx (via fetch POST)
 */

import { NextRequest, NextResponse } from "next/server";
import { generateQrCodeArtWithFalAi } from "@/lib/FalAiQrArtGenerationService";
import { checkAndIncrementRateLimit } from "@/lib/SimpleInMemoryRateLimiter";
import {
  getCurrentUserPricingTier,
  getCurrentUserUniqueIdentifier,
} from "@/lib/AuthenticationPlaceholder";
import { findPricingTierById } from "@/lib/StripePricingConfiguration";
import { checkServerSideRateLimit } from "@/lib/server-ip-rate-limiter";

/**
 * POST /api/generate
 *
 * Request body:
 *   - targetUrl (string, required): The URL to encode in the QR code
 *   - stylePrompt (string, required): The artistic style prompt for the AI
 *
 * Response (200):
 *   - generatedImageUrl (string): CDN URL of the generated image
 *   - remainingGenerations (number): How many more generations today
 *
 * Response (400): Invalid request body
 * Response (429): Rate limit exceeded
 * Response (500): Generation failed
 */
export async function POST(request: NextRequest) {
  try {
    /**
     * Step 0: Server-side IP rate limit check (MUST be FIRST — before any other logic).
     *
     * This is the genuine server-side gate that prevents anonymous abuse of our
     * paid fal.ai API key. Any bot or script that bypasses the client-side
     * localStorage modal and calls this endpoint directly will be blocked here.
     *
     * We intentionally place this BEFORE JSON parsing so that rate-limited requests
     * are rejected with minimal server work (no body read, no auth, no fal.ai call).
     *
     * See src/lib/server-ip-rate-limiter.ts for full rationale, constants (3 req/IP/24h,
     * 100 global budget per instance), and Upstash Redis upgrade path.
     */
    const rateLimitResult = checkServerSideRateLimit(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error:
            "Free tier limit reached. Upgrade to Pro for unlimited QR art generations.",
          upgradeUrl: "/pricing",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil(
                (rateLimitResult.windowResetTimestampMs - Date.now()) / 1000
              )
            ),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    /**
     * Step 1: Parse and validate the request body.
     * We require both targetUrl and stylePrompt to be non-empty strings.
     */
    let requestBody: { targetUrl?: string; stylePrompt?: string };

    try {
      requestBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { targetUrl, stylePrompt } = requestBody;

    if (!targetUrl || typeof targetUrl !== "string" || targetUrl.trim().length === 0) {
      return NextResponse.json(
        { error: "targetUrl is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!stylePrompt || typeof stylePrompt !== "string" || stylePrompt.trim().length === 0) {
      return NextResponse.json(
        { error: "stylePrompt is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    /**
     * Basic URL validation — check that the URL looks reasonable.
     * We don't enforce strict URL parsing because some users might enter
     * URLs without the protocol prefix, and we'd rather be permissive
     * than reject valid inputs. fal.ai will handle the QR encoding.
     */
    if (targetUrl.trim().length > 2048) {
      return NextResponse.json(
        { error: "URL is too long (max 2048 characters)" },
        { status: 400 }
      );
    }

    /**
     * Step 2: Identify the user and determine their pricing tier.
     * In v1, this is IP-based. When auth is added, it will be user-based.
     */
    const userIdentifier = await getCurrentUserUniqueIdentifier();
    const userTierId = await getCurrentUserPricingTier();
    const userTier = findPricingTierById(userTierId);

    /*
     * Default to free tier limits if the tier lookup fails.
     * This should never happen in practice (the free tier always exists),
     * but defensive coding prevents unexpected 500 errors.
     */
    const dailyLimit = userTier?.dailyGenerationLimit ?? 3;

    /**
     * Step 3: Check rate limit.
     * This must happen BEFORE calling fal.ai because:
     *   - We don't want to incur fal.ai API costs for rate-limited users
     *   - Rate limit responses should be instant (good UX)
     */
    const tierRateLimitResult = checkAndIncrementRateLimit(userIdentifier, dailyLimit);

    if (!tierRateLimitResult.isAllowed) {
      return NextResponse.json(
        {
          error: "Daily generation limit reached. Upgrade your plan for more generations.",
          remainingGenerations: 0,
          dailyLimit: tierRateLimitResult.dailyLimit,
          resetTimestamp: tierRateLimitResult.windowResetTimestamp,
        },
        {
          status: 429,
          headers: {
            /*
             * Standard rate limit headers — helps clients implement backoff
             * and shows rate limit info in browser dev tools.
             */
            "X-RateLimit-Limit": String(tierRateLimitResult.dailyLimit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(tierRateLimitResult.windowResetTimestamp),
            "Retry-After": String(
              Math.max(0, tierRateLimitResult.windowResetTimestamp - Math.floor(Date.now() / 1000))
            ),
          },
        }
      );
    }

    /**
     * Step 4: Call fal.ai to generate the QR art.
     * This is the expensive operation (takes 10-30 seconds, costs money per call).
     * Errors here are caught and returned as 500 responses.
     */
    const generationResult = await generateQrCodeArtWithFalAi({
      targetUrl: targetUrl.trim(),
      stylePrompt: stylePrompt.trim(),
    });

    /**
     * Step 5: Return the generated image URL and remaining count.
     * The client uses generatedImageUrl for display and remainingGenerations
     * to show the user how many they have left.
     */
    return NextResponse.json(
      {
        generatedImageUrl: generationResult.generatedImageUrl,
        imageWidth: generationResult.imageWidthPixels,
        imageHeight: generationResult.imageHeightPixels,
        seed: generationResult.generationSeed,
        remainingGenerations: tierRateLimitResult.remainingGenerations,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": String(tierRateLimitResult.dailyLimit),
          "X-RateLimit-Remaining": String(tierRateLimitResult.remainingGenerations),
          "X-RateLimit-Reset": String(tierRateLimitResult.windowResetTimestamp),
        },
      }
    );
  } catch (error) {
    /**
     * Catch-all error handler — logs the full error server-side but returns
     * a generic message to the client (don't leak internal error details).
     */
    console.error("[/api/generate] Generation failed:", error);

    return NextResponse.json(
      {
        error:
          "QR art generation failed. This could be a temporary issue — please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
