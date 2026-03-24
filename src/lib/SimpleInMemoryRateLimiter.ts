/**
 * SimpleInMemoryRateLimiter.ts — Per-IP rate limiting for QR art generation
 *
 * WHY: We need to enforce daily generation limits per pricing tier (Free: 3/day,
 * Pro: 50/day, Business: unlimited). This rate limiter prevents abuse and ensures
 * fair resource usage while keeping the product viable (fal.ai API calls cost money).
 *
 * WHY IN-MEMORY: For v1, we use a simple in-memory Map for rate limiting because:
 *   1. No external dependency needed (no Redis setup required)
 *   2. Works fine for single-server deployments (Vercel serverless, Cloudflare)
 *   3. Fast — O(1) lookups with no network round-trips
 *
 * LIMITATIONS:
 *   - Resets on server restart (acceptable for v1 — means users occasionally get extra generations)
 *   - Does not work across multiple server instances (not a problem with single-region serverless)
 *   - Uses IP addresses, not user accounts (will upgrade to user-based when auth is added)
 *
 * UPGRADE PATH: When we add user authentication, replace this with:
 *   1. Redis-based rate limiting (Upstash Redis works well with serverless)
 *   2. Per-user tracking instead of per-IP
 *   3. Persistent limits that survive server restarts
 *
 * PRODUCT CONTEXT: Rate limiting directly impacts revenue. If free users can generate
 * unlimited QR art, they have no reason to upgrade. The limits must be enforced
 * reliably enough that most users hit the wall and see the upgrade prompt.
 */

/**
 * A single rate limit record for one IP address.
 * Tracks how many generations they've done today and when the count resets.
 */
interface RateLimitRecord {
  /** Number of generations used in the current daily window */
  generationCountToday: number;
  /** Timestamp (ms since epoch) when this record was created — used for daily reset */
  windowStartTimestamp: number;
}

/**
 * In-memory store mapping IP addresses to their rate limit records.
 *
 * WHY a Map and not a plain object: Maps are more performant for frequent
 * additions/deletions and don't have prototype pollution concerns.
 *
 * This is a module-level variable so it persists across API route invocations
 * within the same serverless function instance (warm invocations).
 */
const rateLimitRecordsByIpAddress = new Map<string, RateLimitRecord>();

/**
 * One day in milliseconds — the duration of each rate limit window.
 * We use a rolling 24-hour window rather than calendar-day resets because:
 *   1. Simpler to implement (no timezone handling needed)
 *   2. Fairer to users in different timezones
 *   3. Prevents the "generate at 11:59pm, then again at 12:01am" exploit
 */
const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

/**
 * Result of a rate limit check — tells the caller whether to allow or deny
 * the request, and provides information for the response headers.
 */
export interface RateLimitCheckResult {
  /** Whether the request should be allowed (true) or denied (false) */
  readonly isAllowed: boolean;
  /** How many generations the user has remaining in this window */
  readonly remainingGenerations: number;
  /** The total daily limit for this user's tier */
  readonly dailyLimit: number;
  /** When the current rate limit window resets (Unix timestamp in seconds) */
  readonly windowResetTimestamp: number;
}

/**
 * Checks whether an IP address is allowed to generate more QR art today.
 *
 * If allowed, increments the counter. If denied, returns remaining = 0.
 * This is an "increment and check" pattern — the counter is incremented
 * BEFORE returning, so the response shows the correct remaining count.
 *
 * @param ipAddress - The client's IP address (from request headers)
 * @param dailyLimit - Maximum generations allowed per day (from the user's pricing tier)
 * @returns RateLimitCheckResult with allow/deny decision and metadata
 *
 * CALLED BY: /api/generate/route.ts (before calling the fal.ai generation service)
 */
export function checkAndIncrementRateLimit(
  ipAddress: string,
  dailyLimit: number
): RateLimitCheckResult {
  const currentTimestamp = Date.now();

  /**
   * Look up the existing rate limit record for this IP.
   * If no record exists, or the existing record's window has expired,
   * we create a fresh record starting at 0 generations.
   */
  let existingRecord = rateLimitRecordsByIpAddress.get(ipAddress);

  if (
    !existingRecord ||
    currentTimestamp - existingRecord.windowStartTimestamp >= ONE_DAY_IN_MILLISECONDS
  ) {
    /*
     * Either first request from this IP, or the 24-hour window has expired.
     * Start a fresh window with 0 generations.
     */
    existingRecord = {
      generationCountToday: 0,
      windowStartTimestamp: currentTimestamp,
    };
    rateLimitRecordsByIpAddress.set(ipAddress, existingRecord);
  }

  /**
   * Calculate when the current window resets — used for the Retry-After
   * response header and displayed to the user in the UI.
   */
  const windowResetTimestamp = Math.ceil(
    (existingRecord.windowStartTimestamp + ONE_DAY_IN_MILLISECONDS) / 1000
  );

  /**
   * Check if the user has reached their daily limit.
   * Infinity > any number, so Business tier (dailyLimit = Infinity) never hits this.
   */
  if (existingRecord.generationCountToday >= dailyLimit) {
    return {
      isAllowed: false,
      remainingGenerations: 0,
      dailyLimit,
      windowResetTimestamp,
    };
  }

  /**
   * Allow the request and increment the counter.
   * We increment BEFORE returning so the remaining count is accurate.
   */
  existingRecord.generationCountToday += 1;

  return {
    isAllowed: true,
    remainingGenerations: dailyLimit - existingRecord.generationCountToday,
    dailyLimit,
    windowResetTimestamp,
  };
}

/**
 * Periodically clean up expired rate limit records to prevent memory leaks.
 *
 * WHY: Without cleanup, the Map grows indefinitely as new IPs make requests.
 * With serverless functions, this is less of a concern (instances are short-lived),
 * but it's good practice and prevents issues in long-running dev servers.
 *
 * We run cleanup every hour, removing records older than 24 hours.
 */
function cleanupExpiredRateLimitRecords(): void {
  const currentTimestamp = Date.now();
  let cleanedCount = 0;

  for (const [ipAddress, record] of rateLimitRecordsByIpAddress.entries()) {
    if (currentTimestamp - record.windowStartTimestamp >= ONE_DAY_IN_MILLISECONDS) {
      rateLimitRecordsByIpAddress.delete(ipAddress);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(
      `[RateLimiter] Cleaned up ${cleanedCount} expired rate limit records. ` +
      `Active records: ${rateLimitRecordsByIpAddress.size}`
    );
  }
}

/**
 * Schedule cleanup to run every hour.
 * setInterval in module scope runs for the lifetime of the serverless function instance.
 * In dev mode, this runs as long as the dev server is up.
 */
setInterval(cleanupExpiredRateLimitRecords, 60 * 60 * 1000);
