/**
 * =============================================================================
 * server-ip-rate-limiter.ts — Durable Upstash rate limiting for ai-qr-art-generator
 * =============================================================================
 *
 * PURPOSE:
 * Prevents anonymous users from making unlimited requests to `/api/generate`,
 * which spends our shared `FAL_KEY` on fal.ai image generation.
 *
 * WHY THIS MODULE WAS UPGRADED (wave-2 hardening — 2026-03-27):
 * The P0 fix on 2026-03-25 replaced the non-existent server gate with an
 * in-memory Map. That Map was per-process — it reset on every Vercel cold
 * start (roughly every 15-30 min of inactivity) and was split across
 * parallel serverless instances, giving determined abusers multiple budget
 * windows. Wave-2 replaces it with Upstash Redis so limits are durable
 * across restarts and consistent across all instances.
 *
 * POSTURE:
 * - We pay for fal.ai calls with our server-side `FAL_KEY`
 * - Free tier: 5 generations per IP per 24-hour sliding window
 * - Storage: Upstash Redis REST (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`)
 * - Failure mode: FAIL CLOSED — if Upstash is not configured, anonymous
 *   traffic is blocked rather than being silently admitted
 *
 * CALLED BY: `app/api/generate/route.ts` (or `src/app/api/generate/route.ts`)
 * DEPENDS ON: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN (Vercel env vars)
 *
 * pane1774 swarm — Builder 4, 2026-03-27 (wave-2 batch hardening)
 * =============================================================================
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

/** Free generations allowed per IP per 24h rolling window */
const MAX_FREE_GENERATIONS_PER_IP = 5;

/** Duration constant for retryAfter fallback when Upstash reset time is unavailable */
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Redis key prefix for Upstash. Using a product-specific prefix keeps keys
 * isolated in case the same Upstash database is shared across the clone fleet
 * (all clones share UPSTASH_REDIS_REST_URL / TOKEN in the org Upstash account).
 */
const RATE_LIMIT_PREFIX = "ai-qr-art-generator:api-generate";

// ---------------------------------------------------------------------------
// Lazy singleton Redis + Ratelimit clients
// ---------------------------------------------------------------------------

let cachedRedisClient: Redis | null = null;
let cachedRatelimitClient: Ratelimit | null = null;

// ---------------------------------------------------------------------------
// Public interfaces — both patterns used across the clone fleet
// ---------------------------------------------------------------------------

/** Returned by checkServerSideRateLimit (Pattern A routes) */
export interface ServerSideRateLimitResult {
  allowed: boolean;
  /** Seconds until the rate limit window resets (0 when allowed) */
  retryAfter: number;
}

type RateLimitRejectionReason =
  | "ip_quota_exceeded"
  | "rate_limiter_not_configured";

/** Returned by checkIpRateLimit (Pattern B routes) */
export interface RateLimitResult {
  allowed: boolean;
  remainingRequests: number;
  retryAfterMs: number;
  rejectionReason?: RateLimitRejectionReason;
}

// ---------------------------------------------------------------------------
// IP extraction helpers
// ---------------------------------------------------------------------------

/**
 * Extract the real client IP from a Next.js Request object.
 *
 * On Vercel, x-real-ip is set by the edge network to the connecting client's
 * IP and cannot be spoofed by the client. x-forwarded-for is a comma-separated
 * chain; we take the leftmost (original client IP). Falls back to "unknown"
 * in local dev / unit tests.
 */
export function extractClientIp(request: Request | NextRequest): string {
  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  return "unknown";
}

/** Alias for extractClientIp — used by baby-gen / bg-remover style routes */
export function extractClientIpAddress(request: Request): string {
  return extractClientIp(request as Request | NextRequest);
}

// ---------------------------------------------------------------------------
// Upstash client initialization (lazy singleton)
// ---------------------------------------------------------------------------

/**
 * Returns the shared Upstash Ratelimit instance, or null if the required
 * environment variables are not present. The null return is intentional —
 * callers must treat it as "blocked" to maintain fail-closed posture.
 */
function getUpstashRateLimiter(): Ratelimit | null {
  if (cachedRatelimitClient) {
    return cachedRatelimitClient;
  }

  const redisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisRestToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisRestUrl || !redisRestToken) {
    // Env vars not set — fail closed. Log so operators know what to provision.
    console.warn(
      "[server-ip-rate-limiter] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN " +
        "is not set. Rate limiting is DISABLED (fail closed — all requests blocked). " +
        "Set these Vercel env vars to enable free-tier access."
    );
    return null;
  }

  cachedRedisClient =
    cachedRedisClient ??
    new Redis({
      url: redisRestUrl,
      token: redisRestToken,
    });

  cachedRatelimitClient = new Ratelimit({
    redis: cachedRedisClient,
    limiter: Ratelimit.slidingWindow(MAX_FREE_GENERATIONS_PER_IP, "24 h"),
    analytics: false,
    prefix: RATE_LIMIT_PREFIX,
  });

  return cachedRatelimitClient;
}

// ---------------------------------------------------------------------------
// Rate limit check functions (both interfaces)
// ---------------------------------------------------------------------------

/**
 * Check whether the given IP is within its durable Redis-backed quota.
 * Returns a RateLimitResult — used by Pattern B routes (checkIpRateLimit style).
 *
 * MUST be called before any fal.ai work begins. If Upstash is not configured,
 * returns allowed=false with rejectionReason="rate_limiter_not_configured".
 * This is intentional fail-closed: no config → no free credits spent.
 */
export async function checkIpRateLimit(
  ipAddress: string
): Promise<RateLimitResult> {
  const rateLimiter = getUpstashRateLimiter();

  if (!rateLimiter) {
    return {
      allowed: false,
      remainingRequests: 0,
      retryAfterMs: RATE_LIMIT_WINDOW_MS,
      rejectionReason: "rate_limiter_not_configured",
    };
  }

  const response = await rateLimiter.limit(ipAddress);

  if (!response.success) {
    return {
      allowed: false,
      remainingRequests: 0,
      retryAfterMs: Math.max(0, response.reset - Date.now()),
      rejectionReason: "ip_quota_exceeded",
    };
  }

  return {
    allowed: true,
    remainingRequests: response.remaining,
    retryAfterMs: 0,
  };
}

/**
 * Check rate limit by extracting the IP from the request directly.
 * Returns a ServerSideRateLimitResult — used by Pattern A routes (checkServerSideRateLimit style).
 *
 * The retryAfter field is in seconds (for Retry-After response headers).
 */
export async function checkServerSideRateLimit(
  request: Request | NextRequest
): Promise<ServerSideRateLimitResult> {
  const clientIpAddress = extractClientIp(request);
  const result = await checkIpRateLimit(clientIpAddress);

  return {
    allowed: result.allowed,
    retryAfter: result.allowed ? 0 : Math.ceil(result.retryAfterMs / 1000),
  };
}
