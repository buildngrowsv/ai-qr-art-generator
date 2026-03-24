/**
 * PricingTierCards.tsx — Renders the three pricing tier cards (Free, Pro, Business)
 *
 * PRODUCT CONTEXT: This component is used on BOTH the landing page (as a section)
 * and the dedicated /pricing page. Having it as a reusable component ensures pricing
 * is always consistent across the site.
 *
 * DESIGN DECISIONS:
 *   - The "recommended" tier (Pro) is visually highlighted with a purple border and
 *     "Most Popular" badge. This uses the classic SaaS pattern of anchoring users
 *     to the middle tier — it feels like the best value compared to Free (limited)
 *     and Business (expensive).
 *   - Check marks use the brand purple color for visual consistency.
 *   - The CTA button text changes based on tier:
 *     Free = "Get Started Free" (removes payment anxiety)
 *     Pro = "Upgrade to Pro" (implies improvement)
 *     Business = "Go Business" (implies scaling up)
 *
 * STRIPE INTEGRATION: The Pro and Business CTAs link to /api/stripe/checkout
 * which creates a Stripe Checkout session and redirects the user. This is the
 * standard Stripe-recommended flow for SaaS subscriptions.
 *
 * CALLED BY:
 *   - src/app/page.tsx (landing page pricing section)
 *   - src/app/pricing/page.tsx (dedicated pricing page)
 */

"use client";

import { ALL_PRICING_TIERS, PricingTierDefinition } from "@/lib/StripePricingConfiguration";

/**
 * The CTA button text for each tier — designed to reduce friction and
 * communicate the right emotion for each upgrade path.
 */
const CALL_TO_ACTION_TEXT_BY_TIER_ID: Record<string, string> = {
  free: "Get Started Free",
  pro: "Upgrade to Pro",
  business: "Go Business",
};

/**
 * Handles the click event for a pricing tier's CTA button.
 * For the free tier, navigates to the dashboard.
 * For paid tiers, initiates a Stripe Checkout session.
 *
 * WHY client-side redirect: We could use a <form> or server action, but
 * a fetch + redirect gives us more control over loading states and error handling.
 *
 * @param tier - The pricing tier that was clicked
 */
async function handlePricingTierCtaClick(tier: PricingTierDefinition): Promise<void> {
  /*
   * Free tier — just go to the dashboard, no payment needed.
   * window.location.href is used instead of Next.js router because we want
   * a full page navigation (simpler than importing useRouter in a non-page component).
   */
  if (tier.tierId === "free") {
    window.location.href = "/dashboard";
    return;
  }

  /*
   * Paid tiers — create a Stripe Checkout session via our API.
   * The API returns a checkout URL that we redirect to.
   *
   * This follows Stripe's recommended "redirect to Checkout" pattern.
   * We pass the priceId so the API knows which product/price to use.
   */
  try {
    const checkoutResponse = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: tier.stripePriceId,
      }),
    });

    const checkoutData = await checkoutResponse.json();

    if (checkoutData.checkoutUrl) {
      window.location.href = checkoutData.checkoutUrl;
    } else {
      console.error("No checkout URL returned from API:", checkoutData);
      alert("Unable to start checkout. Please try again.");
    }
  } catch (error) {
    console.error("Checkout initiation failed:", error);
    alert("Unable to start checkout. Please try again.");
  }
}

export default function PricingTierCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {ALL_PRICING_TIERS.map((tier) => (
        <div
          key={tier.tierId}
          className={`
            relative rounded-2xl border p-8 flex flex-col
            card-glow-on-hover
            ${
              tier.isRecommendedTier
                ? "border-purple-500/50 bg-purple-500/5"
                : "border-white/10 bg-white/[0.02]"
            }
          `}
        >
          {/*
           * "Most Popular" badge — only shown on the recommended tier (Pro).
           * Positioned at the top of the card, overlapping the border for visual emphasis.
           * This badge is proven to increase click-through on the middle tier by 15-30%
           * in SaaS pricing page A/B tests (common industry knowledge, not our data).
           */}
          {tier.isRecommendedTier && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              {tier.tagline}
            </div>
          )}

          {/* Tier name and tagline */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">{tier.displayName}</h3>
            {!tier.isRecommendedTier && (
              <p className="text-sm text-zinc-500 mt-1">{tier.tagline}</p>
            )}
          </div>

          {/*
           * Price display — large and prominent because price is the #1 factor
           * in purchase decisions. The "/mo" is smaller to de-emphasize the
           * recurring nature (standard SaaS design pattern).
           */}
          <div className="mb-6">
            <span className="text-4xl font-bold text-white">{tier.displayPrice}</span>
            {tier.monthlyPriceInCents > 0 && (
              <span className="text-zinc-500 ml-1">/mo</span>
            )}
          </div>

          {/* Daily generation limit — the key differentiator between tiers */}
          <p className="text-sm text-zinc-400 mb-6 pb-6 border-b border-white/5">
            {tier.limitDescription}
          </p>

          {/*
           * Feature list — each feature is a selling point.
           * Check marks use brand purple for the recommended tier and zinc for others
           * to subtly direct attention to the recommended tier's features.
           */}
          <ul className="space-y-3 mb-8 flex-1">
            {tier.featureList.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-start gap-3">
                <svg
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    tier.isRecommendedTier ? "text-purple-400" : "text-zinc-500"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-zinc-300">{feature}</span>
              </li>
            ))}
          </ul>

          {/*
           * CTA button — the most important element on each card.
           * Recommended tier gets the gradient button.
           * Other tiers get a more subtle outlined button.
           */}
          <button
            onClick={() => handlePricingTierCtaClick(tier)}
            className={`
              w-full py-3 rounded-xl font-semibold text-sm transition-all
              ${
                tier.isRecommendedTier
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                  : "border border-white/10 text-white hover:bg-white/5 hover:border-white/20"
              }
            `}
          >
            {CALL_TO_ACTION_TEXT_BY_TIER_ID[tier.tierId] || "Get Started"}
          </button>
        </div>
      ))}
    </div>
  );
}
