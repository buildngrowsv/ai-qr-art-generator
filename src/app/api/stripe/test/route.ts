/**
 * /api/stripe/test — Quick connectivity test for Stripe API
 *
 * Tests whether the Vercel serverless function can reach api.stripe.com
 * using native fetch (no SDK). Used to diagnose connection errors.
 *
 * DELETE THIS ROUTE once Stripe checkout is confirmed working.
 */

import { NextResponse } from "next/server";

export async function GET() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY not set" }, { status: 503 });
  }

  try {
    // Direct REST call — bypasses the Stripe SDK entirely
    const priceId = "price_1TEUivGsPhSTDD4xrSMxEyHG";
    const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;
    const appUrl =
      configuredUrl && configuredUrl.startsWith("https://")
        ? configuredUrl
        : "https://ai-qr-art-generator.vercel.app";
    // Return debug info so we can see what URL is actually being used
    const debugInfo = { appUrl, configuredUrl, nodeEnv: process.env.NODE_ENV };

    const body = new URLSearchParams({
      mode: "subscription",
      "payment_method_types[0]": "card",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing`,
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const data = await response.json() as Record<string, unknown>;

    if (!response.ok) {
      return NextResponse.json({
        status: response.status,
        stripe_error: data,
        message: "Stripe returned error",
        debug: debugInfo,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      checkout_url: (data as { url: string }).url,
      session_id: (data as { id: string }).id,
    });

  } catch (err) {
    return NextResponse.json({
      error: "Fetch to Stripe failed",
      raw: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}
