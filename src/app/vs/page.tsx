/**
 * /vs/ Index Page — SEO Comparison Hub for QRArtify
 *
 * PURPOSE:
 * This page serves as an SEO landing page targeting "QRArtify alternative",
 * "QR code art generator comparison", and similar high-intent search queries.
 * Users searching "[competitor] alternative" are actively evaluating tools,
 * making them high-conversion prospects. By hosting comparison pages on our
 * domain, we capture this traffic and control the narrative.
 *
 * SEO STRATEGY:
 * - Each comparison page targets "[competitor name] alternative" keywords
 * - Internal linking between comparison pages builds topical authority
 * - Feature tables provide structured data Google can parse for rich snippets
 * - Clear CTAs convert comparison shoppers into users
 *
 * CREATED: 2026-04-06 for organic traffic growth via comparison SEO
 */

import type { Metadata } from "next";
import Link from "next/link";

import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
const SITE_URL = "https://qrcode.symplyai.io";

export const metadata: Metadata = {
  title: "QRArtify vs Competitors — AI QR Code Art Generator Comparisons",
  description:
    "See how QRArtify compares to QR Code Monkey, QR Tiger, and other QR code generators. Feature-by-feature comparisons to help you choose the best AI QR code art tool.",
  alternates: { canonical: `${SITE_URL}/vs` },
  openGraph: {
    title: "QRArtify vs Competitors — AI QR Code Art Generator Comparisons",
    description:
      "Feature-by-feature comparisons between QRArtify and popular QR code generators.",
    url: `${SITE_URL}/vs`,
    type: "website",
    siteName: "QRArtify",
  },
  robots: { index: true, follow: true },
};

/**
 * Competitor entries displayed on the index page.
 * Each entry links to a dedicated deep-dive comparison page with feature tables,
 * pricing breakdowns, and migration guidance.
 */
const competitors = [
  {
    slug: "qr-code-monkey",
    name: "QR Code Monkey",
    tagline: "Basic customization vs AI-powered art generation",
    description:
      "QR Code Monkey offers color and logo customization for standard QR codes. QRArtify goes further with AI-generated artistic styles that transform QR codes into visual art pieces.",
  },
  {
    slug: "qr-tiger",
    name: "QR Tiger",
    tagline: "Enterprise tracking vs creative AI art styles",
    description:
      "QR Tiger focuses on dynamic QR codes with analytics and tracking. QRArtify focuses on making QR codes beautiful with AI art generation across multiple artistic styles.",
  },
];

export default function VsIndexPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5]">
      {/* Navigation back to main site */}
      <nav className="border-b border-[#1e1e2e] px-6 py-4">
        {/* BreadcrumbList JSON-LD — breadcrumb rich snippets in Google SERPs */}
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "" },
            { name: "Alternatives", url: `${""}/vs` },
          ]}
        />
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-600 bg-clip-text text-xl font-bold text-transparent"
          >
            QRArtify
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white transition hover:from-purple-600 hover:to-fuchsia-700"
          >
            Try QRArtify Free
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            QRArtify vs{" "}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-600 bg-clip-text text-transparent">
              The Competition
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-400">
            See how QRArtify stacks up against popular QR code generators. We
            focus on what matters most: turning boring QR codes into stunning AI
            art that still scans perfectly.
          </p>
        </div>

        {/* Competitor Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {competitors.map((comp) => (
            <Link
              key={comp.slug}
              href={`/vs/${comp.slug}`}
              className="group rounded-2xl border border-[#1e1e2e] bg-[#13131a] p-8 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  QRArtify vs {comp.name}
                </h2>
                <span className="text-purple-400 transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </div>
              <p className="mb-2 text-sm font-medium text-purple-400">
                {comp.tagline}
              </p>
              <p className="text-sm text-zinc-400">{comp.description}</p>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-10 text-center">
          <h2 className="mb-3 text-2xl font-bold">
            Ready to Create Stunning QR Art?
          </h2>
          <p className="mb-6 text-zinc-400">
            Join thousands of creators using AI to make QR codes that are works
            of art. No design skills required.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-600 px-8 py-3 font-semibold text-white transition hover:from-purple-600 hover:to-fuchsia-700"
          >
            Generate QR Art Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2e] px-6 py-8 text-center text-sm text-zinc-500">
        <p>
          &copy; {new Date().getFullYear()} QRArtify.{" "}
          <a
            href="https://symplyai.io"
            target="_blank"
            rel="noopener"
            className="text-purple-400 hover:underline"
          >
            Powered by SymplyAI
          </a>
        </p>
      </footer>
    </div>
  );
}
