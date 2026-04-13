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
      /*
       * og:image — references the dynamic opengraph-image.tsx at src/app/opengraph-image.tsx.
       * This was missing (fleet OG audit 2026-04-13 found qrart.symplyai.io serving
       * no preview image on social shares). Next.js resolves "/opengraph-image"
       * against metadataBase set in the locale layout.
       */
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "QR Art AI — Transform URLs into Stunning QR Code Art",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/opengraph-image"],
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
