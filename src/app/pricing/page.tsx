/**
 * PRICING PAGE — QR Art Studio
 *
 * Dedicated pricing page that mirrors the pricing section on the landing page
 * but includes the actual Stripe checkout integration. When a user clicks
 * "Start Pro Trial" or "Start Business Trial", we create a Stripe Checkout
 * session and redirect them to Stripe's hosted payment page.
 *
 * WHY A SEPARATE PRICING PAGE:
 * - The landing page pricing section is informational (scrolls to it)
 * - This page handles the actual payment flow
 * - Better for SEO ("qr code art pricing" is a search term)
 * - Can be linked directly from upgrade CTAs in the dashboard
 *
 * Created: 2026-03-24 by Coordinator 26 (BridgeSwarm pane1774)
 */

"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * PRICING_TIERS_WITH_STRIPE_PRICE_IDS — Maps our tiers to Stripe price IDs.
 *
 * The price IDs need to be set via environment variables. They differ between
 * Stripe test mode and live mode:
 * - Test: price_xxx (from Stripe test dashboard)
 * - Live: price_yyy (from Stripe live dashboard)
 *
 * For MVP, we fall back to empty strings and show an error if the price IDs
 * aren't configured. This prevents accidental charges against wrong products.
 */
const PRICING_TIERS_WITH_STRIPE_CONFIG = [
  {
    tierName: "Free",
    monthlyPriceDisplay: "$0",
    tierDescription: "Perfect for trying it out",
    stripePriceId: null,
    featuresIncluded: [
      "3 generations per day",
      "Standard resolution (1024px)",
      "10 art styles",
      "QR Art Studio watermark",
    ],
    callToActionText: "Start Free",
    callToActionHref: "/dashboard",
    isHighlightedTier: false,
  },
  {
    tierName: "Pro",
    monthlyPriceDisplay: "$9",
    tierDescription: "For creators & marketers",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || null,
    featuresIncluded: [
      "50 generations per day",
      "4K resolution (4096px)",
      "All 50+ art styles",
      "No watermark",
      "Custom brand colors",
      "Priority generation queue",
      "Email support",
    ],
    callToActionText: "Start Pro Trial",
    callToActionHref: null,
    isHighlightedTier: true,
  },
  {
    tierName: "Business",
    monthlyPriceDisplay: "$29",
    tierDescription: "For teams & agencies",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID || null,
    featuresIncluded: [
      "Unlimited generations",
      "4K resolution (4096px)",
      "All 50+ art styles",
      "No watermark",
      "Brand kit (colors, logos, templates)",
      "API access (coming soon)",
      "Batch generation",
      "Priority support",
    ],
    callToActionText: "Start Business Trial",
    callToActionHref: null,
    isHighlightedTier: false,
  },
];

export default function QrArtStudioPricingPage() {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<string | null>(
    null
  );

  /**
   * handleStripeCheckoutRedirect — Creates a Stripe Checkout session
   * and redirects the user to Stripe's hosted payment page.
   *
   * We use Stripe Checkout (hosted) instead of Stripe Elements (embedded)
   * because:
   * 1. Faster to implement (no custom payment form needed)
   * 2. Handles 3D Secure, Apple Pay, Google Pay automatically
   * 3. PCI compliant out of the box (payment data never touches our server)
   * 4. Stripe handles tax calculation if enabled
   */
  async function handleStripeCheckoutRedirect(
    stripePriceId: string,
    tierName: string
  ) {
    setIsCheckoutLoading(tierName);

    try {
      const checkoutResponse = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: stripePriceId }),
      });

      const checkoutResult = await checkoutResponse.json();

      if (checkoutResult.url) {
        window.location.href = checkoutResult.url;
      } else {
        alert("Failed to create checkout session. Please try again.");
      }
    } catch (checkoutError) {
      console.error("Checkout error:", checkoutError);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsCheckoutLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-indigo-950/50">
      {/* Nav */}
      <nav className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold text-white hover:text-purple-300 transition-colors"
        >
          QR Art Studio
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Back to Generator
        </Link>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Start free. Upgrade when you need more generations, higher resolution, or no watermark.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {PRICING_TIERS_WITH_STRIPE_CONFIG.map((tier) => (
            <div
              key={tier.tierName}
              className={`relative rounded-2xl p-8 ${
                tier.isHighlightedTier
                  ? "border-2 border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                  : "border border-white/10 bg-white/5"
              }`}
            >
              {tier.isHighlightedTier && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1 text-sm font-semibold text-white">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-semibold text-white">
                {tier.tierName}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                {tier.tierDescription}
              </p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-white">
                  {tier.monthlyPriceDisplay}
                </span>
                {tier.monthlyPriceDisplay !== "$0" && (
                  <span className="text-zinc-400">/month</span>
                )}
              </p>

              <ul className="mt-8 space-y-3">
                {tier.featuresIncluded.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-zinc-300"
                  >
                    <span className="mt-0.5 text-green-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {tier.callToActionHref ? (
                <Link
                  href={tier.callToActionHref}
                  className="mt-8 block w-full rounded-full border border-white/20 py-3 text-center font-semibold text-white transition-all hover:bg-white/10"
                >
                  {tier.callToActionText}
                </Link>
              ) : (
                <button
                  onClick={() =>
                    tier.stripePriceId &&
                    handleStripeCheckoutRedirect(
                      tier.stripePriceId,
                      tier.tierName
                    )
                  }
                  disabled={
                    !tier.stripePriceId ||
                    isCheckoutLoading === tier.tierName
                  }
                  className={`mt-8 block w-full rounded-full py-3 text-center font-semibold transition-all ${
                    tier.isHighlightedTier
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/25"
                      : "border border-white/20 text-white hover:bg-white/10"
                  } ${!tier.stripePriceId ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {isCheckoutLoading === tier.tierName
                    ? "Redirecting to checkout..."
                    : tier.callToActionText}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FAQ section for SEO and trust */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 grid gap-6 text-left sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-semibold text-white">
                Are the QR codes actually scannable?
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Yes! Every QR code is verified for scannability before delivery.
                Our AI balances aesthetics with functionality.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-semibold text-white">
                Can I cancel anytime?
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Absolutely. No contracts, no hidden fees. Cancel your subscription
                anytime from your Stripe billing portal.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-semibold text-white">
                What art styles are available?
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                We offer 50+ curated styles including watercolor, cyberpunk,
                Japanese art, minimal, and more. Pro users can also use custom
                prompts.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-semibold text-white">
                What resolution are the QR codes?
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Free tier generates at 1024px. Pro and Business users get up to
                4096px — perfect for print materials and large format displays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
