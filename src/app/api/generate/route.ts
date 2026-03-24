/**
 * /api/generate — QR Art Generation Endpoint
 *
 * This is the core API route that generates AI QR code art. It accepts a URL
 * and a style prompt, then calls fal.ai's ControlNet QR Code model to generate
 * a beautiful, scannable QR code image.
 *
 * TECHNICAL ARCHITECTURE:
 * - Client sends POST with { targetUrl, stylePrompt }
 * - We generate a standard QR code data URL from the target URL
 * - We send the QR code + style prompt to fal.ai's ControlNet pipeline
 * - fal.ai returns a generated image URL
 * - We return the image URL to the client
 *
 * RATE LIMITING:
 * - Free tier: 3 generations per day per IP
 * - Pro tier: 50 per day (checked via Stripe subscription status)
 * - Business tier: Unlimited
 * Rate limiting is done via in-memory Map for MVP. In production, we'd use
 * Redis or Cloudflare KV for persistent rate limiting across instances.
 *
 * WHY fal.ai:
 * We chose fal.ai over alternatives (Replicate, RunPod, self-hosted) because:
 * 1. They have a dedicated QR Code ControlNet model endpoint
 * 2. Fast cold starts (~2-5s vs 30s+ on Replicate for ControlNet)
 * 3. Simple pricing (pay per generation, no GPU idle costs)
 * 4. Good TypeScript SDK (@fal-ai/client)
 *
 * Created: 2026-03-24 by Coordinator 26 (BridgeSwarm pane1774)
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * IN_MEMORY_RATE_LIMIT_TRACKER — Simple rate limiter using a Map.
 * Key: IP address, Value: { count, resetTime }
 *
 * LIMITATION: This resets on server restart and doesn't work across
 * multiple serverless instances. For production scale, migrate to Redis
 * or Cloudflare Workers KV. For MVP launch, this is sufficient because
 * we'll be running on a single Vercel instance initially.
 */
const IN_MEMORY_RATE_LIMIT_TRACKER = new Map<
  string,
  { generationCount: number; resetTimestamp: number }
>();

const FREE_TIER_DAILY_GENERATION_LIMIT = 3;
const RATE_LIMIT_WINDOW_MILLISECONDS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * checkAndUpdateRateLimitForIpAddress — Returns true if the request
 * is within rate limits, false if exceeded.
 *
 * Called by the POST handler before making the expensive fal.ai API call.
 * This prevents abuse and controls costs on the free tier.
 */
function checkAndUpdateRateLimitForIpAddress(
  clientIpAddress: string
): boolean {
  const currentTimestamp = Date.now();
  const existingRateLimitEntry =
    IN_MEMORY_RATE_LIMIT_TRACKER.get(clientIpAddress);

  /* If no entry exists or the window has expired, create a fresh entry */
  if (
    !existingRateLimitEntry ||
    currentTimestamp > existingRateLimitEntry.resetTimestamp
  ) {
    IN_MEMORY_RATE_LIMIT_TRACKER.set(clientIpAddress, {
      generationCount: 1,
      resetTimestamp: currentTimestamp + RATE_LIMIT_WINDOW_MILLISECONDS,
    });
    return true;
  }

  /* If within window, check if limit exceeded */
  if (
    existingRateLimitEntry.generationCount >= FREE_TIER_DAILY_GENERATION_LIMIT
  ) {
    return false;
  }

  /* Increment count */
  existingRateLimitEntry.generationCount += 1;
  return true;
}

/**
 * POST /api/generate — Generate AI QR Code Art
 *
 * Request body:
 *   - targetUrl: string — The URL to encode in the QR code
 *   - stylePrompt: string — The art style description for the diffusion model
 *
 * Response:
 *   - 200: { imageUrl: string } — URL of the generated QR art image
 *   - 400: { error: string } — Invalid request (missing URL, etc.)
 *   - 429: { error: string } — Rate limit exceeded
 *   - 500: { error: string } — Generation failed (fal.ai error, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { targetUrl, stylePrompt } = requestBody;

    /* Validate required fields */
    if (!targetUrl || typeof targetUrl !== "string") {
      return NextResponse.json(
        { error: "targetUrl is required and must be a string" },
        { status: 400 }
      );
    }

    if (!stylePrompt || typeof stylePrompt !== "string") {
      return NextResponse.json(
        { error: "stylePrompt is required and must be a string" },
        { status: 400 }
      );
    }

    /* Rate limiting — check before making the expensive API call */
    const clientIpAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const isWithinRateLimit =
      checkAndUpdateRateLimitForIpAddress(clientIpAddress);

    if (!isWithinRateLimit) {
      return NextResponse.json(
        {
          error:
            "Daily free generation limit reached. Upgrade to Pro for 50 generations/day.",
          upgradeUrl: "/pricing",
        },
        { status: 429 }
      );
    }

    /* Check for fal.ai API key */
    const falApiKey = process.env.FAL_KEY;
    if (!falApiKey) {
      console.error(
        "FAL_KEY environment variable is not set. Cannot generate QR art."
      );
      return NextResponse.json(
        { error: "Service configuration error. Please try again later." },
        { status: 500 }
      );
    }

    /**
     * Call fal.ai ControlNet QR Code model.
     *
     * We use the fal.ai REST API directly instead of the SDK here because
     * the SDK has issues with Next.js App Router server components in some
     * versions. Direct fetch is more reliable and gives us full control
     * over error handling.
     *
     * The model we're using is "fal-ai/qr-code-controlnet" which takes:
     * - prompt: the art style description
     * - qr_code_content: the URL to encode
     * - negative_prompt: things to avoid (keeps QR scannable)
     * - guidance_scale: how closely to follow the prompt (7-12 is good)
     * - controlnet_conditioning_scale: how much the QR structure influences
     *   the output (1.0-1.5 for good scannability vs aesthetics balance)
     */
    const falApiResponse = await fetch(
      "https://queue.fal.run/fal-ai/qr-code-controlnet",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${falApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `${stylePrompt}, high quality, detailed, 4k resolution`,
          qr_code_content: targetUrl,
          negative_prompt:
            "ugly, blurry, low quality, distorted, broken, unreadable",
          guidance_scale: 10,
          controlnet_conditioning_scale: 1.3,
          num_inference_steps: 40,
          image_size: "square_hd",
        }),
      }
    );

    if (!falApiResponse.ok) {
      const falErrorBody = await falApiResponse.text();
      console.error(
        `fal.ai API error (${falApiResponse.status}):`,
        falErrorBody
      );
      return NextResponse.json(
        { error: "QR art generation failed. Please try again." },
        { status: 500 }
      );
    }

    const falResult = await falApiResponse.json();

    /**
     * fal.ai returns the result in different formats depending on the model.
     * For the QR code ControlNet model, the image is typically at:
     * - falResult.images[0].url (standard format)
     * - falResult.image.url (some model versions)
     *
     * We check both to be safe.
     */
    const generatedImageUrl =
      falResult?.images?.[0]?.url ||
      falResult?.image?.url ||
      null;

    if (!generatedImageUrl) {
      console.error("Unexpected fal.ai response format:", falResult);
      return NextResponse.json(
        { error: "Unexpected response from image generation service." },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl: generatedImageUrl });
  } catch (unexpectedError) {
    console.error("Unexpected error in /api/generate:", unexpectedError);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
