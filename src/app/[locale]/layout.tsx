/**
 * [locale]/layout.tsx — Locale-aware HTML shell for QR Art AI
 *
 * PURPOSE:
 * This is the TRUE root layout — it provides the full HTML document
 * (html, head, body) wrapped in next-intl's NextIntlClientProvider.
 * It replaces the former src/app/layout.tsx, which is now a pass-through.
 *
 * WHAT THIS PRESERVES FROM THE ORIGINAL layout.tsx:
 *   1. Geist Sans + Geist Mono Google Fonts (CSS variables --font-geist-*)
 *   2. globals.css import (Tailwind + custom dark-theme styles)
 *   3. SiteHeaderNavigation (sticky header, shown on all pages)
 *   4. SiteFooterSection (shown on all pages)
 *   5. JSON-LD structured data (SoftwareApplication + FAQPage schema)
 *   6. Dark theme + flex-col body layout (pt-16 for fixed header offset)
 *
 * WHAT WAS ADDED FOR i18n:
 *   - `lang={locale}` on <html> for correct screen reader / SEO locale signaling
 *   - NextIntlClientProvider wraps the app to propagate messages to client components
 *   - generateStaticParams exports EN+ES locales for static generation
 *   - generateMetadata uses getTranslations to serve locale-specific title/description
 *   - setRequestLocale enables static rendering (avoids dynamic per-request overhead)
 *   - alternates.languages hreflang tells Google which locale each URL serves
 *
 * DESIGN DECISION: Dark theme throughout (no light mode in v1).
 * Rationale: AI/creative tools feel more premium with dark backgrounds,
 * and QR art images pop better against dark surfaces.
 *
 * ADDED: 2026-03-24 as part of EN+ES i18n rollout (next-intl ^3.26.5).
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import SiteHeaderNavigation from "@/components/SiteHeaderNavigation";
import SiteFooterSection from "@/components/SiteFooterSection";
import "../globals.css";

/**
 * Load Geist Sans — the primary body font.
 * CSS variable --font-geist-sans is referenced in globals.css.
 * Geist is Vercel's own font family — clean, modern, and highly readable.
 * It gives a professional SaaS appearance with zero design overhead.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Load Geist Mono — used for code-like elements (URLs, technical text).
 * CSS variable --font-geist-mono is referenced in globals.css.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * The canonical site URL. Update when a custom domain is configured.
 * Used for canonical, hreflang alternates, and Open Graph URL.
 */
const siteUrl = "https://ai-qr-art-generator.vercel.app";

/**
 * JSON-LD structured data — SoftwareApplication schema.
 * Added 2026-03-24 by Scout 15 for SEO across all clone apps.
 * QR code generators have strong commercial intent — businesses search
 * for branded QR codes for marketing materials, events, and packaging.
 * The schema is injected inline in <head> so Google can parse it without
 * executing JS (compatible with googlebot's rendering behavior).
 */
const jsonLdSoftwareApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AI QR Art Generator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Transform any URL into beautiful artistic QR codes. Choose from dozens of styles — watercolor, geometric, circuit board, floral, and more. All QR codes are guaranteed to scan.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "featureList": [
    "Artistic QR code generation",
    "Multiple visual styles",
    "Guaranteed scannable output",
    "High-resolution download",
  ],
};

/**
 * JSON-LD structured data — FAQPage schema.
 * Answers the three most common questions users have before trying the tool.
 * FAQPage schema can earn Google rich snippets (expanded Q&A in search results),
 * which dramatically increases click-through rate for commercial queries.
 */
const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do artistic QR codes still scan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our AI generates beautiful QR code art while preserving error-correction data. All codes are tested to scan correctly.",
      },
    },
    {
      "@type": "Question",
      "name": "Is the QR art generator free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Generate up to 3 artistic QR codes for free daily. Upgrade for unlimited generations.",
      },
    },
    {
      "@type": "Question",
      "name": "What styles are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dozens of styles including watercolor, geometric, circuit board, floral, neon, minimalist, and more.",
      },
    },
  ],
};

/**
 * generateStaticParams — tells Next.js which locale segments to pre-render.
 * Without this, [locale] pages would be dynamically server-rendered on each
 * request. With it, Next.js builds static HTML for /en and /es at build time.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * generateMetadata — locale-aware SEO metadata.
 *
 * Uses next-intl's getTranslations to fetch the title and description
 * for the current locale from src/messages/{locale}.json.
 *
 * HREFLANG ALTERNATES: Tells Google which URL serves which language,
 * preventing duplicate content penalties and enabling locale switching
 * in Google Search results. x-default points to the EN canonical URL.
 *
 * OPEN GRAPH LOCALE: Set to "es_ES" for Spanish and "en_US" for English
 * so social sharing cards display in the user's language.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "QR code art",
      "AI QR code generator",
      "artistic QR codes",
      "QR code design",
      "beautiful QR codes",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      // OG locale uses underscore format per Open Graph spec
      locale: locale === "es" ? "es_ES" : "en_US",
      url: locale === "es" ? `${siteUrl}/es` : siteUrl,
      siteName: "QR Art AI",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: siteUrl,
      languages: {
        en: siteUrl,
        es: `${siteUrl}/es`,
        "x-default": siteUrl,
      },
    },
  };
}

/**
 * LocaleLayout — the actual HTML document shell.
 *
 * PARAMS: locale is a Promise in Next.js 15+ (async params).
 * We must await it before using it in any server component.
 *
 * setRequestLocale(locale) — must be called before any async operations
 * that use next-intl. It seeds the locale for the current request so that
 * getTranslations() and useTranslations() resolve to the correct locale
 * without having to pass locale down through every component.
 *
 * getMessages() — loads all message keys for the locale into the
 * NextIntlClientProvider, making them available to client components
 * via useTranslations() without a separate fetch.
 *
 * BODY STRUCTURE:
 * - min-h-full flex flex-col: ensures footer sticks to bottom on short pages
 * - pt-16: 4rem offset for the fixed sticky header (h-16 = 64px)
 * - main flex-1: pushes footer to the bottom by expanding the content area
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Seed the locale for this request — required for static rendering support
  setRequestLocale(locale);

  // Load all messages for this locale to pass to the client provider
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/*
         * JSON-LD structured data injected inline in <head>.
         * Using dangerouslySetInnerHTML is the standard Next.js pattern for
         * JSON-LD — it's safe here because the content is our own static
         * objects, not user input.
         */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      {/*
       * Body uses min-h-full + flex col to ensure the footer sticks to the
       * bottom of the viewport even on short pages. The pt-16 accounts for
       * the fixed header height (h-16 = 4rem = 64px).
       */}
      <body className="min-h-full flex flex-col pt-16">
        {/*
         * NextIntlClientProvider makes message translations available to
         * client components via useTranslations(). Without this wrapper,
         * client components calling useTranslations() would throw because
         * they have no access to the server-loaded messages.
         */}
        <NextIntlClientProvider messages={messages}>
          <SiteHeaderNavigation />
          <main className="flex-1">{children}</main>
          <SiteFooterSection />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
