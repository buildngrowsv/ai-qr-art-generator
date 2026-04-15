/**
 * /best — Index page listing all "Best [Category]" listicle pages.
 *
 * WHY THIS PAGE EXISTS:
 * Acts as an internal hub linking to every /best/[slug] pSEO page.
 * Gives Google a crawlable directory of our high-intent comparison content.
 * Also provides breadcrumb anchor for the /best/ prefix so [slug] pages
 * have a real parent in BreadcrumbJsonLd.
 *
 * ROUTE: /best
 * CHILDREN: /best/[slug] (see [slug]/page.tsx)
 *
 * DATA SOURCE: lib/seo-pages.ts → getSeoPageConfig().bestForPages
 *
 * IMPORT PATTERN: Uses @/ alias (resolves to src/) matching [slug]/page.tsx.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { getSeoPageConfig } from "@/lib/seo-pages";
import { PRODUCT_CONFIG } from "@/lib/config";
import { siteConfig } from "@/config/site";

const canonicalUrl = `${siteConfig.siteUrl}/best`;

export const metadata: Metadata = {
  title: `Best AI QR Art Generators in 2026 — ${PRODUCT_CONFIG.name}`,
  description:
    "Compare the best AI QR art generators in 2026. Create scannable, artistic QR codes for restaurants, e-commerce, events, and marketing.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: `Best AI QR Art Generators in 2026 — ${PRODUCT_CONFIG.name}`,
    description:
      "Compare the best AI QR art generators in 2026. Create scannable, artistic QR codes for restaurants, e-commerce, events, and marketing.",
    type: "website",
    url: canonicalUrl,
  },
};

export default function BestIndexPage() {
  const productName = PRODUCT_CONFIG.name;
  const config = getSeoPageConfig();
  const bestPages = config.bestForPages;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.siteUrl },
          { name: "Best", url: canonicalUrl },
        ]}
      />

      <main className="min-h-screen bg-surface-primary text-text-primary">
        {/* Navigation bar — matches [slug] page nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-primary/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold gradient-text">
              {productName}
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/pricing"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors"
              >
                Try Free
              </Link>
            </div>
          </div>
        </nav>

        <div className="pt-24 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Hero */}
            <section className="mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-text-secondary mb-6">
                Updated for 2026
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Best AI QR Art Generators in 2026
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed max-w-3xl">
                Side-by-side reviews of the top AI QR art tools — from
                restaurant menu codes to e-commerce product links and event
                ticketing. Find the right QR art generator for your workflow.
              </p>
            </section>

            {/* Card grid — one card per /best/[slug] page */}
            <section className="mb-16">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bestPages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/best/${page.slug}`}
                    className="group p-6 rounded-xl bg-surface-secondary border border-white/5 hover:border-brand-500/30 transition-colors"
                  >
                    <h2 className="text-lg font-semibold mb-2 group-hover:text-brand-400 transition-colors">
                      Best for {page.audience}
                    </h2>
                    <p className="text-sm text-text-secondary line-clamp-3">
                      {page.whyFit}
                    </p>
                    <span className="inline-block mt-4 text-sm font-medium text-brand-400">
                      Read comparison &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Cross-link to /vs/ */}
            <div className="text-center mb-12">
              <Link
                href="/vs"
                className="text-sm text-text-secondary hover:text-brand-400 transition-colors"
              >
                See head-to-head comparisons &rarr;
              </Link>
            </div>

            {/* CTA */}
            <section className="text-center py-12 px-8 rounded-2xl bg-surface-secondary border border-white/5">
              <h2 className="text-3xl font-bold mb-4">
                Ready to create artistic QR codes?
              </h2>
              <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
                Turn boring QR codes into stunning AI-generated art. Fully
                scannable, completely customizable. Free to try, no signup
                required.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Create QR Art Free
              </Link>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
