/**
 * StripeClientInitializer.ts — Server-side Stripe SDK singleton (lazy-initialized)
 *
 * WHY: Stripe recommends creating a single Stripe instance per server process to
 * avoid creating new HTTPS connections on every API call. This module exports a
 * function that returns a singleton Stripe client configured with our secret key.
 *
 * WHY LAZY INITIALIZATION: We use a getter function instead of a top-level const
 * because Next.js evaluates route modules at build time to collect page data.
 * If we throw at module load time when STRIPE_SECRET_KEY is missing, the build
 * fails even though the key will be available at runtime. Lazy initialization
 * defers the check to when the client is actually needed (at runtime only).
 *
 * PRODUCT CONTEXT: The AI QR Art Generator uses Stripe for subscription billing
 * (Pro at $9/mo, Business at $29/mo). This client is used by:
 *   - /api/stripe/checkout (creates checkout sessions)
 *   - /api/stripe/webhook (processes subscription events)
 *   - /api/stripe/portal (creates customer portal sessions)
 *
 * SECURITY: This file MUST only be imported in server-side code (API routes,
 * server components). The STRIPE_SECRET_KEY must NEVER be exposed to the client.
 *
 * NARRATIVE: We chose Stripe over alternatives (Paddle, LemonSqueezy) because:
 *   1. Most developers/marketers in our target audience already have Stripe accounts
 *   2. Stripe's subscription management is battle-tested
 *   3. Stripe Checkout handles PCI compliance for us
 *   4. The customer portal lets users self-manage subscriptions, reducing support load
 */

import Stripe from "stripe";

/**
 * Cached singleton — once created, reused for all subsequent calls.
 * This avoids creating new Stripe instances (and HTTPS connections) on every API call.
 */
let cachedStripeClient: Stripe | null = null;

/**
 * Returns the singleton Stripe client, creating it on first call.
 *
 * WHY A FUNCTION (not a const export): Next.js evaluates module-level code at
 * build time. If STRIPE_SECRET_KEY is missing at build time (which is normal —
 * env vars are set at runtime in production), a top-level throw would crash the
 * build. By deferring initialization to a function call, we only throw when
 * the client is actually needed at runtime, when env vars are available.
 *
 * @throws Error if STRIPE_SECRET_KEY is not set (at runtime only)
 * @returns The initialized Stripe client singleton
 */
function getStripeServerSideClient(): Stripe {
  if (cachedStripeClient) {
    return cachedStripeClient;
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set in environment variables. " +
      "Payment processing will not work. " +
      "Copy .env.local.example to .env.local and add your Stripe secret key."
    );
  }

  cachedStripeClient = new Stripe(stripeSecretKey, {
    /*
     * We intentionally do NOT pin apiVersion here and let the SDK use its default,
     * because the Stripe npm package version already targets a specific API version.
     * Pinning a mismatched version would cause type errors.
     *
     * NOTE: `typescript: true` was previously here but it is NOT a valid Stripe SDK
     * option in v16+ (and v20.4.1 which we use). Removed 2026-03-25.
     *
     * WHY FetchHttpClient (explicit, not default):
     * Stripe v20 uses FetchHttpClient (native fetch) as its default. We confirmed
     * that raw `fetch` to api.stripe.com WORKS from Vercel's Node.js serverless
     * functions (tested via /api/stripe-test, 200 OK with valid data returned).
     *
     * We tried NodeHttpClient (Node.js https module) but it produced:
     * "An error occurred with our connection to Stripe. Request was retried N times."
     * Reverting to FetchHttpClient (explicit) since fetch is confirmed-working from Vercel.
     *
     * The root cause of the ORIGINAL error (before any of these fixes) was:
     * (1) `typescript: true` invalid option in the Stripe constructor
     * (2) `serverExternalPackages: ['stripe']` missing in next.config.ts causing
     *     webpack to bundle Stripe, which breaks both NodeHttpClient and FetchHttpClient.
     * After fixing (1) and (2), FetchHttpClient works normally.
     *
     * maxNetworkRetries: 1 — fail faster on retry-exhaustion (original default is 2).
     */
    httpClient: Stripe.createFetchHttpClient(),
    maxNetworkRetries: 1,
  });

  return cachedStripeClient;
}

export default getStripeServerSideClient;
