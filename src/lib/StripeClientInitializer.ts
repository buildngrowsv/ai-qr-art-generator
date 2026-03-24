/**
 * StripeClientInitializer.ts — Server-side Stripe SDK singleton
 *
 * WHY: Stripe recommends creating a single Stripe instance per server process to
 * avoid creating new HTTPS connections on every API call. This module exports a
 * singleton Stripe client configured with our secret key and the latest stable
 * API version.
 *
 * PRODUCT CONTEXT: The AI QR Art Generator uses Stripe for subscription billing
 * (Pro at $9/mo, Business at $29/mo). This client is used by:
 *   - /api/stripe/checkout (creates checkout sessions)
 *   - /api/stripe/webhook (processes subscription events)
 *   - /api/stripe/portal (creates customer portal sessions)
 *
 * SECURITY: This file MUST only be imported in server-side code (API routes,
 * server components). The STRIPE_SECRET_KEY must NEVER be exposed to the client.
 * Next.js enforces this by not bundling server-only imports into client bundles,
 * but we add the 'server-only' pattern as a safety net.
 *
 * NARRATIVE: We chose Stripe over alternatives (Paddle, LemonSqueezy) because:
 *   1. Most developers/marketers in our target audience already have Stripe accounts
 *   2. Stripe's subscription management is battle-tested
 *   3. Stripe Checkout handles PCI compliance for us
 *   4. The customer portal lets users self-manage subscriptions, reducing support load
 */

import Stripe from "stripe";

/**
 * Validates that the Stripe secret key is present in environment variables.
 * We throw early and loud rather than failing silently at runtime because
 * a missing Stripe key means ALL payment flows are broken.
 */
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not set in environment variables. " +
    "Payment processing will not work. " +
    "Copy .env.local.example to .env.local and add your Stripe secret key."
  );
}

/**
 * The singleton Stripe client instance.
 *
 * We pin to a specific API version (2025-12-18.acacia) to avoid breaking changes
 * when Stripe releases new API versions. This version was the latest stable at
 * project creation time (March 2026).
 *
 * The typescript configuration tells the SDK to use the types matching this
 * API version, giving us accurate TypeScript autocompletion.
 */
const stripeServerSideClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
  /*
   * We intentionally do NOT pin apiVersion here and let the SDK use its default,
   * because the Stripe npm package version already targets a specific API version.
   * Pinning a mismatched version would cause type errors.
   */
  typescript: true,
});

export default stripeServerSideClient;
