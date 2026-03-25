/**
 * /api/stripe-test — Minimal Stripe connectivity diagnostic
 * TEMPORARY — remove after checkout is confirmed working.
 *
 * Tests raw fetch to Stripe API to isolate whether the issue is:
 * (a) SDK-level (NodeHttpClient vs FetchHttpClient)
 * (b) Network-level (Vercel can't reach api.stripe.com at all)
 */

import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY not set" }, { status: 500 });
  }

  try {
    // Raw fetch to Stripe — bypasses SDK entirely
    const res = await fetch("https://api.stripe.com/v1/customers?limit=1", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });

    const body = await res.json();

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      has_data: !!body.data,
      key_prefix: key.substring(0, 8) + "...",
    });
  } catch (e) {
    return NextResponse.json({
      fetch_error: e instanceof Error ? e.message : String(e),
      key_prefix: key.substring(0, 8) + "...",
    }, { status: 500 });
  }
}
