/**
 * AuthenticationPlaceholder.ts — Stub authentication layer for v1
 *
 * WHY THIS IS A PLACEHOLDER: For v1 launch, we're using IP-based rate limiting
 * instead of user accounts. This keeps the launch scope small and lets us validate
 * the product-market fit before building a full auth system.
 *
 * UPGRADE PLAN (post-launch):
 *   1. Integrate NextAuth.js (or Clerk) for user accounts
 *   2. Store user tier in database (Supabase or PlanetScale)
 *   3. Replace IP-based rate limiting with per-user rate limiting
 *   4. Link Stripe customer IDs to user accounts for subscription management
 *
 * PRODUCT RATIONALE: Many successful SaaS products launch without auth by using
 * IP-based limits + Stripe checkout links. Users can start generating immediately
 * (no signup friction) and only create accounts when they want to upgrade.
 * This maximizes top-of-funnel conversion.
 *
 * WHAT THIS FILE PROVIDES:
 *   - getCurrentUserTier(): Returns the user's pricing tier (defaults to "free")
 *   - getCurrentUserIdentifier(): Returns an identifier for rate limiting (IP address)
 *
 * These functions are used throughout the app. When real auth is added, only THIS
 * file needs to change — all other files reference these functions.
 */

import { headers } from "next/headers";

/**
 * Gets the current user's pricing tier.
 *
 * In v1, everyone is on the "free" tier unless they have an active Stripe subscription.
 * When we add auth, this will look up the user's tier from the database.
 *
 * CALLED BY:
 *   - /api/generate/route.ts (to determine rate limit)
 *   - Dashboard page (to show current plan and remaining generations)
 *
 * @returns The tier ID string ("free", "pro", or "business")
 */
export async function getCurrentUserPricingTier(): Promise<string> {
  /*
   * PLACEHOLDER: Always returns "free" in v1.
   *
   * When auth is implemented, this will:
   *   1. Get the user's session from NextAuth/Clerk
   *   2. Look up their Stripe subscription status
   *   3. Return the corresponding tier ID
   *
   * For now, users effectively "upgrade" by getting a Stripe subscription,
   * but we don't yet track which IP maps to which subscription.
   * This is the FIRST thing to fix post-launch.
   */
  return "free";
}

/**
 * Gets a unique identifier for the current user for rate limiting purposes.
 *
 * In v1, this returns the client's IP address. When we add auth, this will
 * return the user's database ID for more accurate per-user tracking.
 *
 * WHY IP ADDRESS: It's the simplest way to identify unique users without auth.
 * It's imperfect (shared IPs, VPNs) but good enough for v1. The main risk is
 * that users behind corporate NATs share a limit, but this actually encourages
 * those users to upgrade to paid plans — a happy accident.
 *
 * CALLED BY: /api/generate/route.ts (passed to the rate limiter)
 *
 * @returns A string identifier for the current user (IP address in v1)
 */
export async function getCurrentUserUniqueIdentifier(): Promise<string> {
  /*
   * Next.js provides the client IP via various headers depending on the deployment:
   *   - x-forwarded-for: Standard proxy header (Vercel, Cloudflare, etc.)
   *   - x-real-ip: Nginx convention
   *   - Fallback to "unknown" if neither is available (shouldn't happen in production)
   *
   * We check x-forwarded-for first because it's the most common in serverless deployments.
   * x-forwarded-for can contain multiple IPs (client, proxy1, proxy2) — we take the first.
   */
  const headersList = await headers();
  const forwardedForHeader = headersList.get("x-forwarded-for");
  const realIpHeader = headersList.get("x-real-ip");

  if (forwardedForHeader) {
    /*
     * x-forwarded-for format: "client_ip, proxy1_ip, proxy2_ip"
     * We want the client IP (first in the list).
     */
    return forwardedForHeader.split(",")[0].trim();
  }

  if (realIpHeader) {
    return realIpHeader;
  }

  /*
   * Fallback — this should never happen in production but occurs in local dev.
   * Using "localhost" means all local dev requests share a rate limit, which
   * is fine for development.
   */
  return "unknown-localhost";
}
