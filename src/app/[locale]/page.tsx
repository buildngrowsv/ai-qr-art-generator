/**
 * [locale]/page.tsx — Home route with locale-specific SEO metadata
 *
 * Canonical and hreflang are per-page: English default lives at /, Spanish at /es.
 * Marketing copy is rendered by QrArtLandingPageClient (next-intl messages).
 */

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import QrArtLandingPageClient from "@/components/QrArtLandingPageClient";

// Canonical domain — qrart.symplyai.io. Fixed 2026-03-25 (Builder 6): was vercel.app.
const siteUrl = "https://qrart.symplyai.io";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const keywords = t.raw("keywordList") as string[];
  const canonical = locale === "es" ? `${siteUrl}/es` : siteUrl;

  return {
    title: t("title"),
    description: t("description"),
    keywords,
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      url: canonical,
      siteName: "QR Art AI",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages: {
        en: siteUrl,
        es: `${siteUrl}/es`,
        "x-default": siteUrl,
      },
    },
  };
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <QrArtLandingPageClient />;
}
