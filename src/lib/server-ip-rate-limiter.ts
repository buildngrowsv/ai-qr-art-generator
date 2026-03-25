/**
 * =============================================================================
 * server-ip-rate-limiter.ts — Server-Side IP-Based Rate Limiting for API Routes
 * =============================================================================
 *
 * PURPOSE:
 * This module provides genuine server-side rate limiting to prevent anonymous
 * abuse of our paid fal.ai API key. Without this, any bot or curious developer
 * could directly call our /api/generate endpoint and drain our API budget
 * without going through the client-side localStorage checks.
 *
 * WHY THIS EXISTS (P0 HARDENING — 2026-03-25):
 * The ai-qr-art-generator route previously had ONLY client-side localStorage
 * rate limiting. The code comment even acknowledged this: "The primary check is
 * client-side via localStorage, but server-side validation prevents bypass via
 * dev tools." However, that "secondary check" was never actually implemented.
 * This module closes that gap permanently.
 *
 * HOW IT WORKS:
 * We maintain an in-process Map of IP → {requestCount, windowStartTimestamp}.
 * When a request comes in, we check if the IP is within its free tier quota.
 * If not, we return a rate-limited response before fal.ai is ever called.
 *
 * LIMITATIONS (acknowledged, acceptable for freemium tier):
 * 1. State is per-process: Vercel serverless functions may run in multiple
 *    instances simultaneously. A user across two instances effectively gets
 *    2x their limit. This is acceptable for a freemium gate (not a billing
 *    boundary). Proper fix: use @upstash/ratelimit + UPSTASH_REDIS_REST_URL.
 * 2. Memory resets on cold starts (~15-30 min of inactivity on Vercel). This
 *    is also acceptable for a freemium gate. A power user who waits gets reset.
 *
 * WHAT IT PROTECTS AGAINST:
 * - Bots that directly POST to /api/generate without visiting the UI
 * - Scripts that loop the API to abuse our fal.ai credits
 * - Developers who bypass the client-side modal via DevTools network replay
 *
 * PRODUCT POSTURE (documented 2026-03-25):
 * This product is FREEMIUM with HOSTED generation (our FAL_KEY).
 * Protection model: 3 free generations per IP per 24-hour window (server-enforced),
 * + 100 global requests per warm serverless instance (emergency budget guard).
 * Users who need more → Stripe upgrade → unlimited (not yet wired server-side,
 * TODO: check Stripe subscription before bypassing per-IP limit).
 *
 * EXTRACTION PATTERN:
 * IP is extracted from the x-forwarded-for header (set by Vercel's edge network),
 * with fallback to x-real-ip, then to a generic "unknown" bucket. We use the
 * FIRST IP in the forwarded-for chain (the original client, not a proxy).
 * =============================================================================
 */

import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Constants — tune these to adjust the free tier generosity vs. abuse risk
// ---------------------------------------------------------------------------

/**
 * Number of free API calls allowed per unique IP address per time window.
 * Set to 3 to match the client-side localStorage free tier for consistency.
 * The user sees the same number regardless of whether they cleared storage.
 */
const FREE_REQUESTS_PER_IP = 3;

/**
 * Duration of the rate-limit window in milliseconds.
 * 24 hours: resets daily so legitimate occasional users aren't permanently blocked.
 */
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Global per-instance budget: maximum total requests this serverless process
 * instance will serve before returning 429 regardless of IP.
 * This is an emergency guard against extreme abuse that exhausts per-IP quotas
 * across thousands of unique IPs. Set conservatively since each instance
 * typically lives for ~15-30 minutes.
 *
 * At ~0.05-0.15¢ per fal.ai request, 100 requests = ~$0.05-$0.15 max exposure
 * per warm instance lifetime. Acceptable for freemium protection.
 */
const GLOBAL_INSTANCE_BUDGET = 100;

// ---------------------------------------------------------------------------
// In-process state
// ---------------------------------------------------------------------------

/**
 * Per-IP tracking map. Key = IP string, Value = { count, windowStartMs }.
 * Module-level (singleton per process) so it persists across requests within
 * the same warm serverless function instance.
 *
 * Memory: Each entry is ~100 bytes. 1000 IPs = ~100KB. Negligible.
 * Cleanup: We don't prune expired entries because the process lifetime is short
 * (Vercel kills idle lambdas after ~15 min). The map won't grow unbounded.
 */
const ipRequestTrackerMap = new Map<
  string,
  { requestCount: number; windowStartTimestampMs: number }
>();

/**
 * Global remaining budget for this process instance.
 * Starts at GLOBAL_INSTANCE_BUDGET and decrements on every allowed request.
 */
let globalRemainingBudget = GLOBAL_INSTANCE_BUDGET;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Result object returned by checkServerSideRateLimit.
 */
export interface RateLimitCheckResult {
  /** True if the request is allowed to proceed. False if it should be blocked. */
  allowed: boolean;

  /** Number of remaining free requests in the current window for this IP. */
  remainingRequestsForIp: number;

  /** Unix timestamp (ms) when the current window resets for this IP. */
  windowResetTimestampMs: number;

  /** Reason for rejection, populated only when allowed=false. */
  rejectionReason?: "ip_quota_exceeded" | "global_budget_exhausted";
}

/**
 * Checks whether an incoming request is within the server-side rate limit.
 *
 * Call this at the START of any API route that calls a paid third-party service.
 * If it returns allowed=false, immediately return a 429 response to the client.
 *
 * CALLED BY: src/app/api/generate/route.ts (QR Art Generator)
 *
 * @param request - The Next.js request object (used to extract IP).
 * @returns RateLimitCheckResult — call result.allowed before proceeding.
 */
export function checkServerSideRateLimit(
  request: NextRequest
): RateLimitCheckResult {
  // -------------------------------------------------------------------------
  // Step 1: Check global instance budget first (emergency guard)
  // -------------------------------------------------------------------------
  if (globalRemainingBudget <= 0) {
    return {
      allowed: false,
      remainingRequestsForIp: 0,
      windowResetTimestampMs: Date.now() + RATE_LIMIT_WINDOW_MS,
      rejectionReason: "global_budget_exhausted",
    };
  }

  // -------------------------------------------------------------------------
  // Step 2: Extract client IP from request headers
  // -------------------------------------------------------------------------
  const clientIpAddress = extractClientIpAddress(request);

  // -------------------------------------------------------------------------
  // Step 3: Look up (or create) the tracking record for this IP
  // -------------------------------------------------------------------------
  const nowMs = Date.now();
  let ipRecord = ipRequestTrackerMap.get(clientIpAddress);

  if (!ipRecord) {
    // First time we've seen this IP — create a fresh record
    ipRecord = {
      requestCount: 0,
      windowStartTimestampMs: nowMs,
    };
    ipRequestTrackerMap.set(clientIpAddress, ipRecord);
  }

  // -------------------------------------------------------------------------
  // Step 4: Check if the existing window has expired; reset if so
  // -------------------------------------------------------------------------
  const windowElapsedMs = nowMs - ipRecord.windowStartTimestampMs;
  if (windowElapsedMs >= RATE_LIMIT_WINDOW_MS) {
    // Window has expired — reset the counter for a fresh 24-hour period
    ipRecord.requestCount = 0;
    ipRecord.windowStartTimestampMs = nowMs;
  }

  const windowResetTimestampMs =
    ipRecord.windowStartTimestampMs + RATE_LIMIT_WINDOW_MS;

  // -------------------------------------------------------------------------
  // Step 5: Check if this IP has exhausted its per-IP quota
  // -------------------------------------------------------------------------
  if (ipRecord.requestCount >= FREE_REQUESTS_PER_IP) {
    return {
      allowed: false,
      remainingRequestsForIp: 0,
      windowResetTimestampMs,
      rejectionReason: "ip_quota_exceeded",
    };
  }

  // -------------------------------------------------------------------------
  // Step 6: Allow the request — increment counters
  // -------------------------------------------------------------------------
  ipRecord.requestCount += 1;
  globalRemainingBudget -= 1;

  return {
    allowed: true,
    remainingRequestsForIp: FREE_REQUESTS_PER_IP - ipRecord.requestCount,
    windowResetTimestampMs,
  };
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/**
 * Extracts the original client IP address from request headers.
 *
 * On Vercel, the x-forwarded-for header contains the real client IP before
 * Vercel's edge proxies. We take the FIRST entry in a comma-separated list,
 * which is the original client (subsequent entries are proxies/CDN nodes).
 *
 * Header priority:
 * 1. x-forwarded-for (Vercel standard, contains real client IP)
 * 2. x-real-ip (fallback for some proxy setups)
 * 3. "unknown" (last resort — all "unknown" requests share the same bucket)
 */
function extractClientIpAddress(request: NextRequest): string {
  const forwardedForHeader = request.headers.get("x-forwarded-for");
  if (forwardedForHeader) {
    // "x-forwarded-for: client, proxy1, proxy2" — take first (original client)
    const firstIp = forwardedForHeader.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const realIpHeader = request.headers.get("x-real-ip");
  if (realIpHeader) {
    return realIpHeader.trim();
  }

  // Fall back to a shared "unknown" bucket. All requests without IP headers
  // share one quota. This prevents unbounded abuse from headerless clients
  // while not crashing requests from unusual network configurations.
  return "unknown";
}
