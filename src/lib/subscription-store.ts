/**
 * src/lib/subscription-store.ts — QR Art Generator Pro subscription persistence layer
 *
 * PURPOSE:
 * Provides durable per-token Pro subscription state backed by Upstash Redis.
 * Used by three routes:
 *   - /api/stripe/checkout  → generates a token, stores "pending" state
 *   - /api/stripe/webhook   → activates the token on checkout.session.completed
 *   - /api/generate         → checks if the request's token is "active" (bypasses rate limit)
 *
 * TOKEN LIFECYCLE:
 *   pending  → checkout session created but not paid yet (1h TTL)
 *   active   → payment confirmed via Stripe webhook (13-month TTL)
 *   cancelled → subscription cancelled (future use)
 *
 * WHY TOKEN-BASED INSTEAD OF USER AUTH:
 * ai-qr-art-generator is a lightweight freemium clone with no user database.
 * Full Better Auth + Neon + Drizzle would take a full sprint to wire up.
 * The subscription token pattern gives us durable Pro gating quickly:
 *   1. Server generates UUID at checkout creation
 *   2. Token stored as client_reference_id in Stripe session
 *   3. Success URL includes token so client can capture it in localStorage
 *   4. Webhook activates the token when payment succeeds
 *   5. Client includes token in generate requests via x-pro-token header
 *   6. Generate route checks Redis before applying rate limit
 *
 * TOKEN EXPIRY:
 * Active tokens expire after 13 months (covers annual billing cycle + buffer).
 * Pending tokens expire after 1 hour (abandoned checkouts should not linger).
 *
 * GRACEFUL DEGRADATION:
 * If UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN are not configured,
 * all calls fail closed with console warnings. This means:
 *   - Pending tokens are not stored (checkout still works — user can still pay)
 *   - Webhook acknowledges but does not persist Pro status
 *   - Generate route treats all requests as free tier (conservative / fail-closed)
 *
 * This allows the code to deploy and compile even before Upstash is provisioned.
 * Configure Vercel env vars to unlock Pro gating.
 *
 * NAMESPACE:
 * Redis keys use the prefix `qrart:sub:token:` to isolate this product's
 * subscription tokens from rate-limit keys and other clone fleet data in the
 * shared Upstash database.
 *
 * REQUIRED ENV VARS (Vercel dashboard):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * CALLED BY:
 *   src/app/api/stripe/checkout/route.ts
 *   src/app/api/stripe/webhook/route.ts
 *   src/app/api/generate/route.ts
 *
 * pane1774 swarm — T018 Upstash Pro subscription token lifecycle, 2026-03-27
 * Modeled after ai-hairstyle-generator/src/lib/subscription-store.ts (Builder 7, 2026-03-25)
 * and adapted with the qrart namespace for ai-qr-art-generator.
 */

import { Redis } from "@upstash/redis";

// -------------------------------------------------------------------------
// Redis client — lazy singleton, fails gracefully if env vars are missing
// -------------------------------------------------------------------------

let _redisClient: Redis | null = null;
let _redisInitAttempted = false;

/**
 * getRedisClient — returns a shared Redis instance, or null if not configured.
 *
 * We use lazy init so the build does not fail when UPSTASH env vars are absent
 * (e.g. local dev, pre-Vercel-setup). The null check at each call site ensures
 * operations simply skip when Redis is unavailable rather than crashing.
 */
function getRedisClient(): Redis | null {
  if (_redisInitAttempted) {
    return _redisClient;
  }

  _redisInitAttempted = true;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn(
      "[subscription-store] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set. " +
        "Pro subscription persistence is DISABLED. Set these Vercel env vars to enable."
    );
    return null;
  }

  try {
    _redisClient = new Redis({ url, token });
    return _redisClient;
  } catch (err) {
    console.error("[subscription-store] Failed to initialize Redis client:", err);
    return null;
  }
}

// -------------------------------------------------------------------------
// Token key helpers
// -------------------------------------------------------------------------

/**
 * Redis key for a subscription token.
 * Uses the qrart namespace to isolate from other clone fleet keys in the
 * same shared Upstash database.
 */
function subTokenKey(token: string): string {
  return `qrart:sub:token:${token}`;
}

// -------------------------------------------------------------------------
// TTLs
// -------------------------------------------------------------------------

/** Pending checkout session expires after 1 hour */
const PENDING_TTL_SECONDS = 60 * 60;

/** Active Pro subscription is valid for 13 months (covers annual billing + buffer) */
const ACTIVE_TTL_SECONDS = 13 * 30 * 24 * 60 * 60;

// -------------------------------------------------------------------------
// Public API
// -------------------------------------------------------------------------

export type SubscriptionStatus = "pending" | "active" | "cancelled";

/**
 * createPendingToken — called by /api/stripe/checkout when creating a session.
 *
 * Stores the token as "pending" with a 1-hour TTL so we can later activate it
 * when the webhook fires. The token is also passed as `client_reference_id` in
 * the Stripe session so the webhook can look it up by that field.
 *
 * Returns the token string. If Redis is unavailable, the token is still
 * returned (checkout flow continues) but nothing is stored in Redis —
 * Pro status will not be grantable for this purchase.
 */
export async function createPendingToken(): Promise<string> {
  // Cryptographically random UUID — safe to expose in success URL
  const token = crypto.randomUUID();

  const redis = getRedisClient();
  if (!redis) {
    // No Redis — token is still valid for the checkout flow but Pro status
    // will not be persisted when webhook fires. Log so operators can see.
    console.warn(
      "[subscription-store] createPendingToken: Redis unavailable — token not stored.",
      { token }
    );
    return token;
  }

  try {
    await redis.setex(subTokenKey(token), PENDING_TTL_SECONDS, "pending");
  } catch (err) {
    console.error("[subscription-store] createPendingToken: Redis write failed:", err);
    // Still return the token so checkout doesn't break
  }

  return token;
}

/**
 * activateToken — called by /api/stripe/webhook on checkout.session.completed.
 *
 * Upgrades the token status from "pending" to "active" and extends its TTL
 * to 13 months. If the token was never stored (no Redis at checkout time),
 * we create it as "active" directly so the user gets Pro access.
 */
export async function activateToken(token: string): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) {
    console.warn(
      "[subscription-store] activateToken: Redis unavailable — cannot persist Pro status.",
      { token }
    );
    return false;
  }

  try {
    await redis.setex(subTokenKey(token), ACTIVE_TTL_SECONDS, "active");
    console.log("[subscription-store] activateToken: token activated in Redis", { token });
    return true;
  } catch (err) {
    console.error("[subscription-store] activateToken: Redis write failed:", err);
    return false;
    // Fail silently — webhook will retry, and we don't want to return 500 to Stripe
  }
}

/**
 * cancelToken — called on customer.subscription.deleted.
 *
 * Marks the token as cancelled. We keep it in Redis so we can respond with
 * a "subscription cancelled" message instead of "invalid token" if the user
 * tries to use it after cancellation.
 */
export async function cancelToken(token: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    // Keep cancelled tokens for 30 days so the client gets a clear error
    await redis.setex(subTokenKey(token), 30 * 24 * 60 * 60, "cancelled");
  } catch (err) {
    console.error("[subscription-store] cancelToken: Redis write failed:", err);
  }
}

/**
 * checkTokenStatus — checks if a given Pro token exists in Redis and returns its status.
 *
 * Returns the subscription status or null if not found.
 * Used by /api/generate to decide whether to bypass rate limiting.
 */
export async function checkTokenStatus(
  token: string
): Promise<SubscriptionStatus | null> {
  // Basic sanity check — reject obviously invalid tokens before hitting Redis
  if (!token || typeof token !== "string" || token.length < 10) {
    return null;
  }

  const redis = getRedisClient();
  if (!redis) {
    // Redis not configured — treat all tokens as unverifiable (free tier)
    // This is fail-closed: without Redis, nobody gets Pro bypass.
    return null;
  }

  try {
    const status = await redis.get<string>(subTokenKey(token));
    if (!status) return null;

    // Validate the stored value is one of our known statuses
    if (status === "active" || status === "pending" || status === "cancelled") {
      return status as SubscriptionStatus;
    }

    return null;
  } catch (err) {
    console.error("[subscription-store] checkTokenStatus: Redis read failed:", err);
    // Fail conservatively — if Redis is flaky, don't grant Pro access
    return null;
  }
}

/**
 * isProActive — convenience wrapper that returns true only if the token
 * status is "active". Used in the generate route for the Pro bypass check.
 *
 * Returns false for: null tokens, undefined tokens, pending tokens, cancelled tokens,
 * and any Redis error condition (fail closed).
 */
export async function isProActive(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const status = await checkTokenStatus(token);
  return status === "active";
}
