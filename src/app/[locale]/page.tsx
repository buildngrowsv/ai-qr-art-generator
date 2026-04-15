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
  return (
    <main>
      <QrArtLandingPageClient />

      {/* ── Pricing CTA (server-rendered for SEO) ──────────────────── */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              Try 3 free QR art codes — no account required. Upgrade for more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* FREE */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Free</h3>
                <div className="mt-1">
                  <span className="text-3xl font-bold text-white">$0</span>
                  <span className="text-gray-500 ml-1 text-sm">/month</span>
                </div>
              </div>
              <ul className="space-y-2">
                {["3 QR codes per day", "All art styles", "PNG export", "No account required"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="text-teal-400 mt-0.5 shrink-0">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* PRO */}
            <div className="relative rounded-xl border-2 border-teal-500/50 bg-white/5 p-6 space-y-4 shadow-lg shadow-teal-500/10">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                MOST POPULAR
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Pro</h3>
                <div className="mt-1">
                  <span className="text-3xl font-bold text-white">$9.99</span>
                  <span className="text-gray-500 ml-1 text-sm">/month</span>
                </div>
              </div>
              <ul className="space-y-2">
                {["100 QR codes per month", "All art styles", "SVG + PNG export", "Commercial license"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="text-teal-400 mt-0.5 shrink-0">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/pricing" className="block w-full text-center py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-all duration-200 hover:scale-[1.02]">
                Upgrade to Pro
              </a>
            </div>

            {/* BUSINESS */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Business</h3>
                <div className="mt-1">
                  <span className="text-3xl font-bold text-white">$29.90</span>
                  <span className="text-gray-500 ml-1 text-sm">/month</span>
                </div>
              </div>
              <ul className="space-y-2">
                {["Unlimited QR codes", "All art styles", "Priority processing", "Team accounts", "API access"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="text-teal-400 mt-0.5 shrink-0">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/pricing" className="block w-full text-center py-2.5 rounded-lg border border-teal-500/50 hover:bg-teal-500/10 text-teal-400 text-sm font-semibold transition-all duration-200">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
