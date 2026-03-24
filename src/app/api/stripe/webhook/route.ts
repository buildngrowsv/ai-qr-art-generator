/**
 * /api/stripe/webhook — Handles incoming Stripe webhook events
 *
 * This endpoint receives webhook events from Stripe whenever something important
 * happens with a customer's subscription (created, updated, cancelled, payment failed).
 *
 * WHY WEBHOOKS (not polling):
 *   - Stripe sends events in real-time (no delay)
 *   - We don't need to poll Stripe's API (saves API calls, reduces latency)
 *   - Webhooks are the Stripe-recommended pattern for subscription management
 *   - Events include all the data we need to update user status
 *
 * SECURITY:
 *   - Every webhook payload is verified using the STRIPE_WEBHOOK_SECRET
 *   - This prevents attackers from sending fake events to our endpoint
 *   - We read the raw body (not JSON-parsed) because Stripe's signature
 *     verification requires the exact bytes
 *
 * EVENTS WE HANDLE:
 *   - checkout.session.completed — User just subscribed, activate their plan
 *   - customer.subscription.updated — Plan changed (upgrade/downgrade)
 *   - customer.subscription.deleted — Subscription cancelled, revert to free
 *   - invoice.payment_failed — Payment failed, may need to downgrade
 *
 * CALLED BY: Stripe servers (configured in Stripe Dashboard > Webhooks)
 */

import { NextRequest, NextResponse } from "next/server";
import stripeServerSideClient from "@/lib/StripeClientInitializer";
import Stripe from "stripe";

/**
 * POST /api/stripe/webhook
 *
 * This endpoint must:
 *   1. Read the raw request body (for signature verification)
 *   2. Verify the Stripe signature
 *   3. Handle the event based on its type
 *   4. Return 200 to acknowledge receipt (Stripe retries on non-200)
 */
export async function POST(request: NextRequest) {
  try {
    /**
     * Step 1: Read the raw body as text.
     *
     * IMPORTANT: We MUST use request.text() not request.json() because Stripe's
     * signature verification requires the exact raw bytes of the payload.
     * If we parse to JSON and re-stringify, the bytes may differ (key ordering,
     * whitespace) and the signature check will fail.
     */
    const rawRequestBody = await request.text();

    /**
     * Step 2: Get the Stripe signature from the request headers.
     * Stripe includes this header on every webhook request.
     * If it's missing, the request is definitely not from Stripe.
     */
    const stripeSignatureHeader = request.headers.get("stripe-signature");

    if (!stripeSignatureHeader) {
      console.error("[Stripe Webhook] Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    /**
     * Step 3: Verify the webhook signature using our webhook secret.
     * This cryptographically proves the event came from Stripe and wasn't tampered with.
     * If verification fails, we reject the request immediately.
     */
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured. " +
        "Webhook verification will fail. Set this in .env.local."
      );
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    let verifiedStripeEvent: Stripe.Event;

    try {
      verifiedStripeEvent = stripeServerSideClient.webhooks.constructEvent(
        rawRequestBody,
        stripeSignatureHeader,
        webhookSecret
      );
    } catch (signatureError) {
      console.error(
        "[Stripe Webhook] Signature verification failed:",
        signatureError
      );
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    /**
     * Step 4: Handle the event based on its type.
     *
     * Each event type corresponds to a different lifecycle event in the
     * subscription process. We log all events and handle the important ones.
     */
    console.log(
      `[Stripe Webhook] Received event: ${verifiedStripeEvent.type} ` +
      `(id: ${verifiedStripeEvent.id})`
    );

    switch (verifiedStripeEvent.type) {
      /**
       * checkout.session.completed — A user just completed checkout.
       *
       * This is fired when a user successfully pays on the Stripe Checkout page.
       * At this point, their subscription is active and we should upgrade their account.
       *
       * In v1 (no auth), we log the event. When auth is added:
       *   1. Look up the customer email from the session
       *   2. Find the user in our database
       *   3. Update their tier to match the subscribed plan
       */
      case "checkout.session.completed": {
        const checkoutSession = verifiedStripeEvent.data.object as Stripe.Checkout.Session;
        console.log(
          `[Stripe Webhook] Checkout completed! ` +
          `Customer: ${checkoutSession.customer}, ` +
          `Subscription: ${checkoutSession.subscription}, ` +
          `Amount: ${checkoutSession.amount_total}c ${checkoutSession.currency}`
        );

        /*
         * TODO (post-auth): Update user tier in database.
         * const userEmail = checkoutSession.customer_details?.email;
         * const subscriptionId = checkoutSession.subscription;
         * await updateUserTier(userEmail, subscriptionId);
         */
        break;
      }

      /**
       * customer.subscription.updated — A subscription was changed.
       *
       * This fires on upgrades, downgrades, and other subscription changes.
       * We check the new price to determine the new tier.
       */
      case "customer.subscription.updated": {
        const updatedSubscription = verifiedStripeEvent.data.object as Stripe.Subscription;
        console.log(
          `[Stripe Webhook] Subscription updated! ` +
          `ID: ${updatedSubscription.id}, ` +
          `Status: ${updatedSubscription.status}`
        );

        /*
         * TODO (post-auth): Update user tier based on new subscription.
         * const priceId = updatedSubscription.items.data[0]?.price?.id;
         * const newTier = findPricingTierByStripePriceId(priceId);
         * await updateUserTier(updatedSubscription.customer, newTier);
         */
        break;
      }

      /**
       * customer.subscription.deleted — A subscription was cancelled.
       *
       * This fires when a subscription ends (after cancellation period expires).
       * We should revert the user to the free tier.
       */
      case "customer.subscription.deleted": {
        const deletedSubscription = verifiedStripeEvent.data.object as Stripe.Subscription;
        console.log(
          `[Stripe Webhook] Subscription cancelled! ` +
          `ID: ${deletedSubscription.id}, ` +
          `Customer: ${deletedSubscription.customer}`
        );

        /*
         * TODO (post-auth): Revert user to free tier.
         * await revertUserToFreeTier(deletedSubscription.customer);
         */
        break;
      }

      /**
       * invoice.payment_failed — A subscription payment failed.
       *
       * This means the user's card was declined. Stripe will retry automatically
       * (configurable in Stripe Dashboard under Billing > Subscription settings).
       * We should notify the user so they can update their payment method.
       */
      case "invoice.payment_failed": {
        const failedInvoice = verifiedStripeEvent.data.object as Stripe.Invoice;
        console.log(
          `[Stripe Webhook] Payment failed! ` +
          `Customer: ${failedInvoice.customer}, ` +
          `Amount: ${failedInvoice.amount_due}c`
        );

        /*
         * TODO (post-auth): Send email notification to user about failed payment.
         * await sendPaymentFailedEmail(failedInvoice.customer);
         */
        break;
      }

      default:
        /**
         * Log unhandled events for debugging — we don't need to act on every
         * event type, but logging them helps us notice if we're missing
         * important ones.
         */
        console.log(
          `[Stripe Webhook] Unhandled event type: ${verifiedStripeEvent.type}`
        );
    }

    /**
     * Step 5: Return 200 to acknowledge receipt.
     *
     * CRITICAL: We MUST return 200 for all events, even ones we don't handle.
     * If we return non-200, Stripe will retry the webhook up to 3 days,
     * which wastes their resources and clutters our logs.
     */
    return NextResponse.json(
      { received: true, eventType: verifiedStripeEvent.type },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Stripe Webhook] Unexpected error:", error);

    /*
     * Return 500 on unexpected errors. Stripe will retry, which is what we want —
     * if this was a transient error (database timeout, etc.), the retry will succeed.
     */
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
