/**
 * PricingTierCards.tsx — Three pricing tier cards (Free, Pro, Business)
 *
 * Tier limits and Stripe IDs still come from StripePricingConfiguration (single
 * source of truth for billing). Display strings come from next-intl (PricingTiers)
 * so EN/ES cards match the rest of the marketing surface (Builder 25, T13).
 *
 * Free-tier CTA uses i18n router.push("/dashboard") so Spanish users land on /es/dashboard.
 */

"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ALL_PRICING_TIERS, PricingTierDefinition } from "@/lib/StripePricingConfiguration";

function resolveStripePaymentLinkForTier(tierId: string): string | null {
  if (tierId === "pro") {
    return process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO?.trim() || null;
  }
  if (tierId === "business") {
    return process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BUSINESS?.trim() || null;
  }
  return null;
}

export default function PricingTierCards() {
  const router = useRouter();
  const tTier = useTranslations("PricingTiers");
  const tCard = useTranslations("PricingCards");

  async function handlePricingTierCtaClick(tier: PricingTierDefinition): Promise<void> {
    if (tier.tierId === "free") {
      router.push("/dashboard");
      return;
    }

    const paymentLinkUrl = resolveStripePaymentLinkForTier(tier.tierId);
    if (paymentLinkUrl) {
      window.open(paymentLinkUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const priceId = tier.stripePriceId;
    if (!priceId || !priceId.startsWith("price_")) {
      // Payment Link fallback: QR Art Studio Pro ($9.99/mo) — no env vars needed.
      // When neither NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO nor a valid price_ ID
      // is configured on Vercel, redirect to the pre-built Stripe Payment Link.
      // This ensures checkout always works on fresh deploys without env var setup.
      // Source: Github/ai-clone-stripe-links.md — Builder 6 pane1774 2026-03-25.
      window.location.href = "https://buy.stripe.com/bJe14n9bP0cg5Z981jfMA09";
      return;
    }

    try {
      const checkoutResponse = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
        }),
      });

      const checkoutData = await checkoutResponse.json();

      if (checkoutData.checkoutUrl) {
        window.location.href = checkoutData.checkoutUrl;
      } else {
        console.error("No checkout URL returned from API:", checkoutData);
        alert(checkoutData.error || tCard("checkoutFailed"));
      }
    } catch (error) {
      console.error("Checkout initiation failed:", error);
      alert(tCard("checkoutGeneric"));
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {ALL_PRICING_TIERS.map((tier) => {
        const tierKey = tier.tierId as "free" | "pro" | "business";
        const features = tTier.raw(`${tierKey}.features`) as string[];
        const displayName = tTier(`${tierKey}.displayName`);
        const displayPrice = tTier(`${tierKey}.displayPrice`);
        const limitDescription = tTier(`${tierKey}.limitDescription`);
        const tagline = tTier(`${tierKey}.tagline`);
        const ctaLabel = tTier(`${tierKey}.cta`);

        return (
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
            {tier.isRecommendedTier && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                {tagline}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">{displayName}</h3>
              {!tier.isRecommendedTier && <p className="text-sm text-zinc-500 mt-1">{tagline}</p>}
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">{displayPrice}</span>
              {tier.monthlyPriceInCents > 0 && (
                <span className="text-zinc-500 ml-1">{tCard("perMonth")}</span>
              )}
            </div>

            <p className="text-sm text-zinc-400 mb-6 pb-6 border-b border-white/5">
              {limitDescription}
            </p>

            <ul className="space-y-3 mb-8 flex-1">
              {features.map((feature, featureIndex) => (
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

            <button
              type="button"
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
              {ctaLabel || tCard("ctaFallback")}
            </button>
          </div>
        );
      })}
    </div>
  );
}
