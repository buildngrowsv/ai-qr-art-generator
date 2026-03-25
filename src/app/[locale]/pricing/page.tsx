/**
 * [locale]/pricing/page.tsx — Dedicated pricing + FAQ (locale-aware)
 *
 * Metadata targets pricing-intent keywords with correct canonical per locale.
 * FAQ copy comes from messages (EN/ES) to stay aligned with support positioning.
 */

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PricingTierCards from "@/components/PricingTierCards";

// Canonical domain — qrart.symplyai.io. Fixed 2026-03-25 (Builder 6): was vercel.app.
const siteUrl = "https://qrart.symplyai.io";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PricingMeta" });
  const canonical = locale === "es" ? `${siteUrl}/es/pricing` : `${siteUrl}/pricing`;

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonical,
      locale: locale === "es" ? "es_ES" : "en_US",
      siteName: "QR Art AI",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/pricing`,
        es: `${siteUrl}/es/pricing`,
        "x-default": `${siteUrl}/pricing`,
      },
    },
  };
}

type PricingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DedicatedPricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("PricingPage");
  const faqItems = t.raw("faqItems") as { question: string; answer: string }[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          {t("titleBefore")}{" "}
          <span className="gradient-text-animated">{t("titleAccent")}</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      <PricingTierCards />

      <div className="mt-24 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">{t("faqHeading")}</h2>

        <div className="space-y-6">
          {faqItems.map((faqItem) => (
            <div
              key={faqItem.question}
              className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
            >
              <h3 className="font-semibold text-white mb-2">{faqItem.question}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{faqItem.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
