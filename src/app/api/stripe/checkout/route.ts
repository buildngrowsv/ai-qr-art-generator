/**
 * /api/stripe/checkout — Create Stripe Checkout Session
 *
 * Creates a Stripe Checkout session for QR Art Studio subscription plans.
 * Called when a user clicks "Start Pro Trial" or "Start Business Trial"
 * on the pricing page.
 *
 * STRIPE PRODUCT SETUP:
 * The Stripe products and prices need to be created in the Stripe Dashboard
 * or via the Stripe CLI before this endpoint works. The price IDs are set
 * via environment variables so they can differ between test and live mode.
 *
 * FLOW:
 * 1. Client sends POST with { priceId, successUrl, cancelUrl }
 * 2. We create a Stripe Checkout Session
 * 3. Return the session URL for redirect
 * 4. Stripe handles payment collection
 * 5. On success, Stripe redirects to successUrl with session_id param
 * 6. Webhook (/api/stripe/webhook) handles subscription activation
 *
 * Created: 2026-03-24 by Coordinator 26 (BridgeSwarm pane1774)
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Initialize Stripe client with the secret key.
 * The API version is pinned to ensure consistent behavior —
 * Stripe occasionally makes breaking changes between versions.
 */
function getStripeClientInstance(): Stripe {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
  }
  return new Stripe(stripeSecretKey, {
    apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { priceId, successUrl, cancelUrl } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "priceId is required" },
        { status: 400 }
      );
    }

    const stripe = getStripeClientInstance();

    /**
     * Create a Checkout Session.
     *
     * We use 'subscription' mode because both Pro and Business are
     * recurring monthly plans. For one-time purchases (e.g., credit packs),
     * we'd use 'payment' mode instead.
     *
     * allow_promotion_codes is enabled so we can offer discount codes
     * for launch promotions without any code changes.
     */
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4827"}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancelUrl ||
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4827"}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (stripeError) {
    console.error("Stripe checkout session creation failed:", stripeError);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
