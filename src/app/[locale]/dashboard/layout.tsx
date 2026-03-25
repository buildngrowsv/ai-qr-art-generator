/**
 * dashboard/layout.tsx — SEO shell for the generation dashboard
 *
 * The dashboard page is a client component; metadata must live in a parent
 * server layout so Next.js can emit title, description, and hreflang alternates.
 */

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

// Canonical domain — qrart.symplyai.io. Fixed 2026-03-25 (Builder 6): was vercel.app.
const siteUrl = "https://qrart.symplyai.io";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DashboardMeta" });
  const canonical = locale === "es" ? `${siteUrl}/es/dashboard` : `${siteUrl}/dashboard`;

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
        en: `${siteUrl}/dashboard`,
        es: `${siteUrl}/es/dashboard`,
        "x-default": `${siteUrl}/dashboard`,
      },
    },
  };
}

export default async function DashboardRouteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return children;
}
