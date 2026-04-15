/**
 * layout.tsx — Root layout pass-through for next-intl locale routing
 *
 * PURPOSE:
 * With next-intl's [locale] segment routing, the actual HTML shell
 * (html, head, body, fonts, header, footer) lives in
 * src/app/[locale]/layout.tsx. This root layout exists only to satisfy
 * Next.js's requirement for a root layout.tsx and simply renders its
 * children, delegating all real layout work to the locale layout.
 *
 * WHY PASS-THROUGH: next-intl requires a [locale] dynamic segment in
 * the app directory so that locale is available as a route param at
 * every level. Having a full HTML shell here AND in [locale]/layout.tsx
 * would cause nested <html> tags and hydration errors.
 *
 * ORIGINAL layout.tsx preserved as [locale]/layout.tsx — all Geist
 * fonts, SiteHeaderNavigation, SiteFooterSection, and JSON-LD structured
 * data are intact there.
 *
 * CHANGED: 2026-03-24 — replaced full layout with pass-through as part
 * of EN+ES i18n rollout (next-intl ^3.26.5).
 */

import type { ReactNode } from "react";
import type { Metadata } from "next";


/**
 * Root-level metadata — fallback for pSEO pages (/for, /vs, /best,
 * /use-cases) served outside the [locale] layout. The [locale] layout
 * generateMetadata overrides these for locale-routed pages.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://qrart.symplyai.io"),
  title: "AI QR Art Generator",
  description: "AI QR Art Generator — AI-powered tool. Free to try, no sign-up required.",
  alternates: {
    canonical: "https://qrart.symplyai.io",
  },
  openGraph: {
    title: "AI QR Art Generator",
    description: "AI QR Art Generator — AI-powered tool. Free to try.",
    type: "website",
    url: "https://qrart.symplyai.io",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
