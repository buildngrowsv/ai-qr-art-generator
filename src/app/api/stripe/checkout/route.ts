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

/*
 * WHY WE USE DIRECT FETCH INSTEAD OF STRIPE SDK HERE:
 * Stripe v20 SDK uses FetchHttpClient (native fetch) by default. In Vercel
 * Node.js serverless functions with Next.js 16, this produces:
 *   "An error occurred with our connection to Stripe. Request was retried N times."
 * Switching to NodeHttpClient also failed (same error with different retry count).
 *
 * Root cause (2026-03-25): the Stripe SDK's http client has issues with the
 * specific Node.js/fetch implementation in Next.js 16 + Vercel serverless.
 * However, plain `fetch()` to the Stripe REST API works perfectly.
 *
 * Solution: bypass the SDK entirely and use native fetch() for this route.
 * This is safe — we're just calling Stripe's REST API which is stable.
 * The SDK is kept in package.json for webhook signature verification in the
 * webhook route (which uses `stripe.webhooks.constructEvent()`).
 */

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

    /*
     * Reject placeholder / garbage IDs early so Stripe does not return opaque 404s
     * and the user sees a clear configuration error instead of a blank failure.
     */
    if (!priceId.startsWith("price_")) {
      return NextResponse.json(
        {
          error:
            "Invalid Stripe price id. Set NEXT_PUBLIC_STRIPE_PRICE_ID_PRO / BUSINESS on Vercel.",
        },
        { status: 400 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        {
          error: "Payments are not configured (missing STRIPE_SECRET_KEY). Add secrets on Vercel.",
          configured: false,
        },
        { status: 503 }
      );
    }

    /**
     * Determine the base URL for redirect URLs.
     *
     * WHY WE AVOID NEXT_PUBLIC_APP_URL AS-IS:
     * Stripe live mode requires HTTPS URLs. If NEXT_PUBLIC_APP_URL is set to
     * http://localhost:4827 (common during initial setup), Stripe rejects with
     * url_invalid. We only use the env var if it starts with https://, otherwise
     * fall back to the hardcoded production URL.
     *
     * Root cause discovered 2026-03-25: the env var was stuck as localhost
     * despite Vercel CLI attempts to update it.
     */
    /*
     * WHY .trim(): When env vars are set via `echo "url" | vercel env add`, the echo
     * command includes a trailing newline (\n). That newline ends up in the env var
     * value and makes the URL invalid (Stripe rejects urls containing \n with url_invalid).
     * Always trim env var URLs before use.
     */
    const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
    const appBaseUrl =
      configuredUrl && configuredUrl.startsWith("https://")
        ? configuredUrl
        : "https://ai-qr-art-generator.vercel.app";

    /**
     * Create the Stripe Checkout Session via direct REST API call.
     *
     * WHY DIRECT FETCH NOT SDK:
     * Stripe v20 SDK HTTP client (FetchHttpClient + NodeHttpClient) both fail
     * in this Next.js 16 + Vercel serverless environment. Native fetch() to the
     * Stripe REST API works reliably. See comment at top of file for full context.
     *
     * Key configuration:
     *   - mode: subscription (monthly recurring plans)
     *   - allow_promotion_codes: true (launch discount codes in Stripe Dashboard)
     *   - success_url: includes {CHECKOUT_SESSION_ID} placeholder (Stripe replaces it)
     */
    /*
     * WHY WE DON'T USE URLSearchParams FOR THE FULL BODY:
     * URLSearchParams.toString() percent-encodes curly braces { and } as %7B / %7D.
     * Stripe's {CHECKOUT_SESSION_ID} placeholder must be sent as literal curly braces
     * in the request body so Stripe can substitute the real session ID on redirect.
     * If they are encoded, Stripe rejects the URL as invalid (url_invalid error).
     *
     * Solution: build the body string manually and append the success_url raw (using
     * encodeURIComponent only on the base URL portion, not on Stripe's placeholder).
     * The cancel_url has no placeholders so it can be encoded normally.
     */
    /*
     * Note: we omit {CHECKOUT_SESSION_ID} placeholder for now — Stripe requires
     * literal curly braces in the URL which can cause url_invalid issues depending
     * on how the form body is encoded. The session ID is not needed for v1 functionality.
     * Can be re-added once basic checkout flow is confirmed working.
     */
    const successUrl = `${appBaseUrl}/dashboard?checkout=success`;
    const cancelUrl = `${appBaseUrl}/pricing?checkout=cancelled`;

    const body = [
      "mode=subscription",
      "payment_method_types[0]=card",
      `line_items[0][price]=${encodeURIComponent(priceId)}`,
      "line_items[0][quantity]=1",
      "allow_promotion_codes=true",
      `success_url=${encodeURIComponent(successUrl)}`,
      `cancel_url=${encodeURIComponent(cancelUrl)}`,
    ].join("&");

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    type StripeCheckoutResponse = { id: string; url: string; error?: { message: string; code: string } };
    const stripeData = await stripeResponse.json() as StripeCheckoutResponse;

    if (!stripeResponse.ok) {
      const stripeMsg = stripeData.error?.message ?? "Unknown Stripe error";
      console.error("[/api/stripe/checkout] Stripe API error:", stripeData);
      return NextResponse.json(
        { error: `Stripe error: ${stripeMsg}`, raw_error: stripeMsg },
        { status: 400 }
      );
    }

    /**
     * Return the checkout URL. The client will redirect the browser to this URL.
     * Stripe hosts the entire checkout page, handles PCI compliance, and
     * redirects back to our app when done.
     */
    return NextResponse.json({
      checkoutUrl: stripeData.url,
      sessionId: stripeData.id,
    });
  } catch (error) {
    console.error("[/api/stripe/checkout] Failed to create checkout session:", error);

    /*
     * In development/debug: expose the raw Stripe error message so we can diagnose.
     * The Stripe error object has .message, .code, .type for structured debugging.
     * We include the actual message in the response body during initial launch so
     * operators can see what's happening from a curl command without needing Vercel logs.
     * TODO: Remove the raw_error field once checkout is confirmed working.
     */
    const stripeError = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error:
          "Failed to create checkout session. Please try again or contact support.",
        raw_error: stripeError,
      },
      { status: 500 }
    );
  }
}
