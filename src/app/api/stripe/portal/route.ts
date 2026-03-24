/**
 * /api/stripe/portal — Creates a Stripe Customer Portal session
 *
 * The Customer Portal is Stripe's hosted page where subscribers can:
 *   - View their current subscription and billing history
 *   - Update their payment method (new card, etc.)
 *   - Upgrade or downgrade their plan
 *   - Cancel their subscription
 *
 * WHY THIS IS IMPORTANT: Self-serve subscription management dramatically reduces
 * support burden. Without this, every plan change or cancellation requires manual
 * intervention. Stripe's Customer Portal handles all of this for us, for free.
 *
 * PREREQUISITES: The Customer Portal must be configured in the Stripe Dashboard
 * (Settings > Customer Portal) before this endpoint will work. You need to enable
 * the portal and configure which actions customers can take.
 *
 * FLOW:
 *   1. Client sends POST with the customer's Stripe customer ID
 *   2. We create a portal session with a return URL
 *   3. Client redirects to the portal URL
 *   4. User manages their subscription on Stripe's hosted page
 *   5. User clicks "Return" and is redirected back to our app
 *
 * CALLED BY: Future dashboard "Manage Subscription" button (post-auth implementation)
 */

import { NextRequest, NextResponse } from "next/server";
import stripeServerSideClient from "@/lib/StripeClientInitializer";

/**
 * POST /api/stripe/portal
 *
 * Request body:
 *   - customerId (string, required): The Stripe Customer ID (cus_XXXXXX)
 *
 * Response (200):
 *   - portalUrl (string): URL to redirect the user to the Customer Portal
 *
 * Response (400): Missing customerId
 * Response (500): Stripe API error
 */
export async function POST(request: NextRequest) {
  try {
    let requestBody: { customerId?: string };

    try {
      requestBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { customerId } = requestBody;

    if (!customerId || typeof customerId !== "string") {
      return NextResponse.json(
        { error: "customerId is required and must be a string" },
        { status: 400 }
      );
    }

    /**
     * Determine the return URL — where Stripe redirects after portal interaction.
     * We send them to the dashboard since that's the main product page.
     */
    const appBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4827";

    /**
     * Create the portal session.
     *
     * The return_url is where Stripe redirects when the user clicks "Return to [app]".
     * We send them to the dashboard with a query param so we can show a
     * confirmation message if needed.
     */
    const portalSession =
      await stripeServerSideClient.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${appBaseUrl}/dashboard?portal=returned`,
      });

    return NextResponse.json({
      portalUrl: portalSession.url,
    });
  } catch (error) {
    console.error("[/api/stripe/portal] Failed to create portal session:", error);

    return NextResponse.json(
      {
        error:
          "Failed to create customer portal session. Please try again or contact support.",
      },
      { status: 500 }
    );
  }
}
