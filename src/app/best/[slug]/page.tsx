/**
 * /best/[slug] — Programmatic SEO "Best For" Pages
 *
 * WHY THIS PAGE EXISTS:
 * Targets long-tail buying-intent keywords like "best AI QR art generator for
 * restaurants" or "best AI QR code art for e-commerce". Each page is statically
 * generated at build time from the bestForPages config in seo-pages.ts (backed
 * by seo-pages.json or auto-generated from seo-config.json). Google indexes
 * these as unique content-rich pages with FAQPage JSON-LD for featured snippets.
 *
 * PATTERN ORIGIN:
 * Adapted from ai-logo-generator's /best/[slug]/page.tsx (proven pattern).
 * Key difference: this repo uses `bestForPages` (BestForPageConfig[]) from
 * seo-pages.ts, not `bestPages` from a separate config.
 *
 * DATA FLOW:
 * seo-pages.json (or seo-config.json fallback) -> seo-pages.ts getSeoPageConfig()
 * -> bestForPages[] -> generateStaticParams() produces slugs -> this page renders
 * each slug with audience-specific content, feature list, FAQ, and JSON-LD.
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import {
  getSeoPageConfig,
  getProductSlug,
  buildFaqJsonLd,
  BestForPageConfig,
} from "@/lib/seo-pages";
import { PRODUCT_CONFIG } from "@/lib/config";
import { siteConfig } from "@/config/site";

/**
 * Prevent Next.js from attempting to SSR unknown slugs — return 404 immediately
 * instead of hanging the serverless function (Gate 12 from clone-factory-quality-gates).
 */
export const dynamicParams = false;

/**
 * Generates the set of valid /best/[slug] paths at build time.
 * Next.js pre-renders one page per entry in bestForPages.
 */
export function generateStaticParams() {
  const config = getSeoPageConfig();
  return config.bestForPages.map((page) => ({
    slug: page.slug,
  }));
}

/**
 * Builds the <head> metadata for each best-for page, targeting the specific
 * audience keyword for search engine indexing and social sharing.
 */
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const config = getSeoPageConfig();
  const page = config.bestForPages.find((p) => p.slug === params.slug);
  if (!page) return {};

  const productSlug = getProductSlug();
  const title = `Best ${PRODUCT_CONFIG.name} for ${page.audience} (2026)`;
  const description = `Why ${PRODUCT_CONFIG.name} is the #1 choice for ${page.audience}. ${page.whyFit}`;
  const canonicalUrl = `${siteConfig.siteUrl}/best/${page.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: PRODUCT_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Renders the full best-for page: hero, feature breakdown, FAQ accordion with
 * JSON-LD, breadcrumbs, cross-links to other best pages, and CTA.
 */
export default function BestForPage({
  params,
}: {
  params: { slug: string };
}) {
  const config = getSeoPageConfig();
  const page = config.bestForPages.find((p) => p.slug === params.slug);
  if (!page) notFound();

  const productSlug = getProductSlug();
  const otherBestPages = config.bestForPages.filter((p) => p.slug !== params.slug);

  return (
    <>
      {/* JSON-LD: FAQPage structured data for Google featured snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqJsonLd(page.faq)),
        }}
      />

      {/* JSON-LD: BreadcrumbList for search result breadcrumb trails */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.siteUrl },
          { name: `Best for ${page.audience}`, url: `${siteConfig.siteUrl}/best/${page.slug}` },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
        {/* Navigation */}
        <nav className="border-b border-white/10 bg-gray-950/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-bold">
              {PRODUCT_CONFIG.name}
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/pricing" className="text-sm text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link
                href="/generate"
                className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium hover:from-purple-500 hover:to-blue-500 transition-all"
              >
                Try Free
              </Link>
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-4xl px-6 py-16">
          {/* Hero section — targets the primary keyword directly */}
          <section className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Best {PRODUCT_CONFIG.name} for{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {page.audience}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-300 leading-relaxed">
              {page.whyFit}
            </p>
            <div className="mt-8">
              <Link
                href="/generate"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 text-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20"
              >
                Try {PRODUCT_CONFIG.name} Free
              </Link>
            </div>
          </section>

          {/* Feature checklist — each feature as a benefit for the audience */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-bold">
              Why {page.audience} Choose {PRODUCT_CONFIG.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {page.topFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-sm">
                    ✓
                  </span>
                  <span className="text-gray-200">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* "Why #1" section — reinforces the keyword with detailed reasoning */}
          <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-4 text-2xl font-bold">
              Why {PRODUCT_CONFIG.name} Is #1 for {page.audience}
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                {page.audience} need tools that are fast, affordable, and produce
                professional results without a learning curve.{" "}
                {PRODUCT_CONFIG.name} delivers on all three — start with{" "}
                {PRODUCT_CONFIG.pricing.free.limit} free generations per{" "}
                {PRODUCT_CONFIG.pricing.free.period}, no signup required for
                your first use.
              </p>
              <p>
                Unlike expensive alternatives that charge $20-50/month,{" "}
                {PRODUCT_CONFIG.name} offers a Basic plan at just $
                {PRODUCT_CONFIG.pricing.basic.price}/month with{" "}
                {PRODUCT_CONFIG.pricing.basic.limit} generations. For heavy
                users, Pro at ${PRODUCT_CONFIG.pricing.pro.price}/month gives
                unlimited access.
              </p>
            </div>
          </section>

          {/* FAQ accordion — each question targets a long-tail keyword variant */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-bold">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {page.faq.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-white/10 bg-white/5"
                >
                  <summary className="cursor-pointer px-6 py-4 text-lg font-medium text-gray-100 hover:text-white transition-colors">
                    {item.question}
                  </summary>
                  <div className="px-6 pb-4 text-gray-300 leading-relaxed">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Cross-links to other /best/ pages for internal linking */}
          {otherBestPages.length > 0 && (
            <section className="mb-16">
              <h2 className="mb-6 text-xl font-bold text-gray-200">
                Also Popular
              </h2>
              <div className="flex flex-wrap gap-3">
                {otherBestPages.slice(0, 8).map((other) => (
                  <Link
                    key={other.slug}
                    href={`/best/${other.slug}`}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 hover:border-purple-500/40 hover:text-white transition-all"
                  >
                    Best for {other.audience}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Final CTA */}
          <section className="text-center rounded-2xl border border-purple-500/20 bg-purple-500/5 p-12">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to Try {PRODUCT_CONFIG.name}?
            </h2>
            <p className="mb-8 text-gray-300">
              Join {page.audience} who already use {PRODUCT_CONFIG.name}.
              Start with {PRODUCT_CONFIG.pricing.free.limit} free generations
              — no credit card required.
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 text-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/20"
            >
              Get Started Free
            </Link>
          </section>
        </main>

        {/* Minimal footer */}
        <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {PRODUCT_CONFIG.name}. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
