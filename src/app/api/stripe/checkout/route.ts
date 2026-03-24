/**
 * /api/stripe/checkout — Creates a Stripe Checkout Session
 *
 * This endpoint is called when a user clicks "Upgrade to Pro" or "Go Business"
 * on the pricing page or pricing cards. It creates a Stripe Checkout session
 * and returns the checkout URL for the client to redirect to.
 *
 * STRIPE FLOW:
 *   1. Client sends POST with the priceId of the desired plan
 *   2. We create a Stripe Checkout session with that price
 *   3. We return the checkout URL
 *   4. Client redirects to Stripe's hosted checkout page
 *   5. User enters payment details on Stripe's page (PCI compliant)
 *   6. Stripe redirects back to our success or cancel URL
 *   7. Stripe sends a webhook event to /api/stripe/webhook (async)
 *
 * WHY STRIPE CHECKOUT (not Stripe Elements):
 *   - Handles PCI compliance automatically (no card data touches our servers)
 *   - Pre-built, optimized checkout UI (Apple Pay, Google Pay, etc.)
 *   - Reduces our liability and development time
 *   - Conversion-optimized by Stripe's team
 *
 * CALLED BY: src/components/PricingTierCards.tsx (via fetch POST)
 */

import { NextRequest, NextResponse } from "next/server";
import stripeServerSideClient from "@/lib/StripeClientInitializer";

/**
 * POST /api/stripe/checkout
 *
 * Request body:
 *   - priceId (string, required): Stripe Price ID of the plan to subscribe to
 *
 * Response (200):
 *   - checkoutUrl (string): URL to redirect the user to Stripe Checkout
 *
 * Response (400): Missing or invalid priceId
 * Response (500): Stripe API error
 */
export async function POST(request: NextRequest) {
  try {
    /**
     * Parse and validate the request body.
     * We require a priceId that matches a Stripe Price ID format.
     */
    let requestBody: { priceId?: string };

    try {
      requestBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { priceId } = requestBody;

    if (!priceId || typeof priceId !== "string") {
      return NextResponse.json(
        { error: "priceId is required and must be a string" },
        { status: 400 }
      );
    }

    /**
     * Determine the base URL for redirect URLs.
     * In development, this is http://localhost:4827.
     * In production, this should be the actual domain.
     *
     * We use NEXT_PUBLIC_APP_URL because it's available in both server
     * and client contexts, and it's explicitly set in .env.local.
     */
    const appBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4827";

    /**
     * Create the Stripe Checkout Session.
     *
     * Key configuration choices:
     *   - mode: "subscription" — we're selling monthly recurring plans
     *   - payment_method_types: ["card"] — start simple, add more later
     *   - allow_promotion_codes: true — lets us offer discount codes
     *   - success_url: dashboard with ?success=true for a success message
     *   - cancel_url: pricing page so they can try again
     *
     * The {CHECKOUT_SESSION_ID} placeholder is replaced by Stripe with the
     * actual session ID, which we could use to verify the session on the
     * success page (not implemented in v1 but ready for it).
     */
    const stripeCheckoutSession =
      await stripeServerSideClient.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        /*
         * Allow Stripe promotion codes — useful for launch promotions.
         * We can create codes in the Stripe Dashboard without code changes.
         */
        allow_promotion_codes: true,

        /*
         * Success URL — redirect here after successful payment.
         * The dashboard page will show a success message when ?checkout=success.
         */
        success_url: `${appBaseUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,

        /*
         * Cancel URL — redirect here if the user clicks "Back" on Stripe.
         * Going back to pricing lets them reconsider or pick a different plan.
         */
        cancel_url: `${appBaseUrl}/pricing?checkout=cancelled`,
      });

    /**
     * Return the checkout URL. The client will redirect the browser to this URL.
     * Stripe hosts the entire checkout page, handles PCI compliance, and
     * redirects back to our app when done.
     */
    return NextResponse.json({
      checkoutUrl: stripeCheckoutSession.url,
      sessionId: stripeCheckoutSession.id,
    });
  } catch (error) {
    console.error("[/api/stripe/checkout] Failed to create checkout session:", error);

    return NextResponse.json(
      {
        error:
          "Failed to create checkout session. Please try again or contact support.",
      },
      { status: 500 }
    );
  }
}
