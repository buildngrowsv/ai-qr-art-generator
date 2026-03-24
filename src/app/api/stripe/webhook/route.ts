/**
 * /api/stripe/webhook — Handle Stripe Webhook Events
 *
 * Receives webhook events from Stripe and processes them. Key events:
 * - checkout.session.completed: New subscription created
 * - customer.subscription.updated: Plan change or renewal
 * - customer.subscription.deleted: Cancellation
 * - invoice.payment_failed: Payment issue
 *
 * SECURITY:
 * - Verifies webhook signature using STRIPE_WEBHOOK_SECRET
 * - Rejects requests with invalid signatures (prevents spoofing)
 * - Uses raw body parsing (required for Stripe signature verification)
 *
 * MVP NOTE:
 * For MVP, we're logging events to console. In production, we'd update
 * a database (user subscription status, generation limits, etc.).
 * The webhook handler is structured so adding database writes is easy —
 * just add the update call in each event handler case.
 *
 * Created: 2026-03-24 by Coordinator 26 (BridgeSwarm pane1774)
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripeClientInstance(): Stripe {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(stripeSecretKey, {
    apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
  });
}

export async function POST(request: NextRequest) {
  const stripe = getStripeClientInstance();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  /* Read raw body for signature verification — Stripe requires the
     raw request body (not parsed JSON) to verify the webhook signature */
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("stripe-signature");

  if (!signatureHeader) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      signatureHeader,
      webhookSecret
    );
  } catch (signatureError) {
    console.error("Webhook signature verification failed:", signatureError);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  /* Handle the event based on type */
  switch (stripeEvent.type) {
    case "checkout.session.completed": {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      console.log(
        `[WEBHOOK] New subscription! Customer: ${session.customer}, Subscription: ${session.subscription}`
      );
      /* TODO: Update user record in database with subscription ID and plan */
      break;
    }

    case "customer.subscription.updated": {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      console.log(
        `[WEBHOOK] Subscription updated: ${subscription.id}, Status: ${subscription.status}`
      );
      /* TODO: Update user subscription status in database */
      break;
    }

    case "customer.subscription.deleted": {
      const cancelledSubscription = stripeEvent.data
        .object as Stripe.Subscription;
      console.log(
        `[WEBHOOK] Subscription cancelled: ${cancelledSubscription.id}`
      );
      /* TODO: Downgrade user to free tier in database */
      break;
    }

    case "invoice.payment_failed": {
      const failedInvoice = stripeEvent.data.object as Stripe.Invoice;
      console.log(
        `[WEBHOOK] Payment failed for customer: ${failedInvoice.customer}`
      );
      /* TODO: Send payment failure notification, possibly downgrade after grace period */
      break;
    }

    default:
      console.log(`[WEBHOOK] Unhandled event type: ${stripeEvent.type}`);
  }

  return NextResponse.json({ received: true });
}
