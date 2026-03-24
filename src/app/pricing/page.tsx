/**
 * pricing/page.tsx — Dedicated pricing page
 *
 * PRODUCT CONTEXT: This page exists separately from the landing page pricing section
 * because it serves a different user intent. Users who navigate directly to /pricing
 * are in "evaluation mode" — they want to compare tiers carefully before deciding.
 *
 * The page uses the shared PricingTierCards component to ensure pricing is always
 * consistent between the landing page and this dedicated page.
 *
 * SEO: This page targets "QR art pricing", "AI QR code plans" keywords.
 * Having a dedicated pricing page also improves conversion — users looking for
 * pricing info can find it directly via search or navigation.
 */

import PricingTierCards from "@/components/PricingTierCards";

export default function DedicatedPricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Page header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          Choose Your{" "}
          <span className="gradient-text-animated">Perfect Plan</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
          Start free with 3 generations per day. Upgrade anytime for more
          generations, higher resolution, and premium features.
        </p>
      </div>

      {/* Pricing cards — shared component used on landing page too */}
      <PricingTierCards />

      {/*
       * FAQ section — addresses common objections before they become blockers.
       * These are the questions we anticipate from users evaluating pricing.
       * Post-launch, we'll add real FAQs based on support tickets.
       */}
      <div className="mt-24 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {[
            {
              question: "Can I try it before paying?",
              answer:
                "Yes! The Free tier gives you 3 QR art generations per day with no sign-up or credit card required. Try it out and upgrade when you need more.",
            },
            {
              question: "Are the generated QR codes really scannable?",
              answer:
                "Absolutely. Our AI is specifically tuned to maintain QR code scannability while adding artistic elements. Every generated code is designed to scan with any standard smartphone camera.",
            },
            {
              question: "Can I cancel my subscription anytime?",
              answer:
                "Yes. You can cancel your Pro or Business subscription at any time through the customer portal. Your plan will remain active until the end of your billing period.",
            },
            {
              question: "What image formats can I download?",
              answer:
                "Free and Pro users can download PNG files. Business users get additional format options including SVG and PDF, perfect for print production.",
            },
            {
              question: "Do I own the generated QR art?",
              answer:
                "Yes. All QR art you generate is yours to use commercially. Business plan users get an explicit commercial license for agency and client work.",
            },
          ].map((faqItem) => (
            <div
              key={faqItem.question}
              className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
            >
              <h3 className="font-semibold text-white mb-2">
                {faqItem.question}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {faqItem.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
