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
import type { Metadata, Viewport} from "next";


/**
 * Root-level metadata — fallback for pSEO pages (/for, /vs, /best,
 * /use-cases) served outside the [locale] layout. The [locale] layout
 * generateMetadata overrides these for locale-routed pages.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://qrart.symplyai.io"),
  title: "QR Art AI — Transform URLs into Stunning QR Code Art",
  description: "Generate beautiful, artistic QR codes powered by AI. Turn any URL into scannable art. Free to try, instant results. Perfect for marketing, events, and branding.",
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

/**
 * Viewport configuration — ensures proper mobile rendering and theme-color
 * for pSEO pages served outside [locale] routing.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
  ],
};


/**
 * FAQPage JSON-LD — enables FAQ rich results in Google SERPs.
 * Product-specific questions about AI QR art generation.
 */
const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does QR Art AI work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enter any URL and choose an art style. Our AI embeds a fully scannable QR code into a beautiful, artistic image. The result looks like custom artwork while remaining functional as a QR code.",
      },
    },
    {
      "@type": "Question",
      name: "Is QR Art AI free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, QR Art AI offers a free tier with 3 QR art generations per day. Paid plans start at $9.99/month for unlimited generations and access to premium art styles.",
      },
    },
    {
      "@type": "Question",
      name: "Do the artistic QR codes actually scan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, every QR art image generated is fully scannable. The AI ensures the QR code pattern remains readable by standard smartphone cameras while integrating it into the artistic design.",
      },
    },
    {
      "@type": "Question",
      name: "What art styles are available for QR codes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QR Art AI offers a wide range of styles including watercolor, cyberpunk, nature landscapes, abstract art, anime, steampunk, and minimalist designs. New styles are added regularly.",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />
      {children}
    </>
  );
}
