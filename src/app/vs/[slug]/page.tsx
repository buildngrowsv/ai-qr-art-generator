/**
 * /vs/[slug] — Dynamic Competitor Comparison Page for QRArtify
 *
 * PURPOSE:
 * Dedicated comparison pages targeting "[competitor] alternative" search queries.
 * These are some of the highest-intent keywords in SaaS — people searching
 * "QR Code Monkey alternative" are actively looking to switch tools.
 *
 * SEO VALUE:
 * - Title tags include both brand names for maximum keyword coverage
 * - Structured feature comparison tables are parseable by search engines
 * - Canonical URLs prevent duplicate content across locale variants
 * - Rich meta descriptions drive CTR from search results
 *
 * ARCHITECTURE:
 * Uses generateStaticParams to pre-render all comparison pages at build time.
 * Each competitor's data (features, pricing, pros/cons) is defined inline
 * rather than fetched from a CMS — these pages change infrequently and
 * static generation gives the best Core Web Vitals scores.
 *
 * CREATED: 2026-04-06 for organic traffic growth via comparison SEO
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
const SITE_URL = "https://qrcode.symplyai.io";

/**
 * Feature comparison row shape.
 * "us" and "them" use string values so we can show nuance
 * (e.g., "AI-generated" vs "Manual templates") rather than just checkmarks.
 */
interface FeatureRow {
  feature: string;
  us: string;
  them: string;
}

interface CompetitorData {
  name: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  heroSubtitle: string;
  introText: string;
  features: FeatureRow[];
  ourAdvantages: string[];
  theirAdvantages: string[];
  verdict: string;
}

/**
 * Competitor comparison data — all the facts for feature tables and copy.
 *
 * WHY INLINE DATA:
 * These pages are updated rarely (when competitors change pricing or features).
 * Keeping data in-code means: (1) no CMS dependency, (2) type safety,
 * (3) build-time rendering for best performance, (4) easy for any builder
 * to update without learning a separate data layer.
 */
const competitors: Record<string, CompetitorData> = {
  "qr-code-monkey": {
    name: "QR Code Monkey",
    slug: "qr-code-monkey",
    metaTitle:
      "QRArtify vs QR Code Monkey (2026) — AI Art QR Codes vs Basic Customization",
    metaDescription:
      "Compare QRArtify and QR Code Monkey side by side. See why creators choose AI-generated artistic QR codes over basic color and logo customization.",
    heroSubtitle: "AI-powered art generation vs basic color customization",
    introText:
      "QR Code Monkey is a well-known free QR code generator that lets you customize colors, add logos, and pick from basic shapes. QRArtify takes a fundamentally different approach: instead of tweaking standard QR codes, our AI generates entirely new artistic interpretations of your QR data. The result is QR codes that look like genuine artwork while remaining fully scannable.",
    features: [
      {
        feature: "AI Art Generation",
        us: "Full AI-powered artistic styles (cyberpunk, watercolor, nature, etc.)",
        them: "No AI generation — manual color/logo customization only",
      },
      {
        feature: "Style Presets",
        us: "8+ AI art styles with unique visual output each time",
        them: "Basic shape templates (dots, rounded, etc.)",
      },
      {
        feature: "Output Uniqueness",
        us: "Every QR code is a unique AI-generated artwork",
        them: "Output follows predictable template patterns",
      },
      {
        feature: "Free Tier",
        us: "3 AI art generations per day, no signup",
        them: "Unlimited basic QR codes, free",
      },
      {
        feature: "Logo Embedding",
        us: "AI integrates branding into the art style",
        them: "Manual logo overlay on standard QR",
      },
      {
        feature: "Scan Reliability",
        us: "AI-optimized error correction ensures scannability",
        them: "Standard error correction (reliable)",
      },
      {
        feature: "Bulk Generation",
        us: "Coming soon (Pro plan)",
        them: "Available (paid plans)",
      },
      {
        feature: "Dynamic QR Codes",
        us: "Static QR codes (URL baked in)",
        them: "Static only (free), dynamic on paid plans",
      },
      {
        feature: "Price (Pro)",
        us: "$9.90/mo — unlimited AI art generations",
        them: "Free basic; paid plans from $6.99/mo for analytics",
      },
    ],
    ourAdvantages: [
      "True AI art generation creates unique, visually stunning QR codes",
      "Multiple artistic styles (cyberpunk, watercolor, nature, minimalist, neon)",
      "Each generation is unique — no two QR codes look the same",
      "AI automatically handles error correction for reliable scanning",
      "Modern dark-mode UI designed for creative professionals",
    ],
    theirAdvantages: [
      "Completely free tier with unlimited basic QR code generation",
      "Well-established brand with years of market presence",
      "Simple interface — no learning curve for basic customization",
      "Bulk generation available on paid plans",
      "EPS/SVG export for print-ready files",
    ],
    verdict:
      "Choose QRArtify if you want QR codes that double as art pieces — for business cards, packaging, menus, and marketing materials where visual impact matters. Choose QR Code Monkey if you need basic, functional QR codes with simple color customization at no cost.",
  },
  "qr-tiger": {
    name: "QR Tiger",
    slug: "qr-tiger",
    metaTitle:
      "QRArtify vs QR Tiger (2026) — AI Art QR Codes vs Enterprise QR Management",
    metaDescription:
      "Compare QRArtify and QR Tiger side by side. AI-generated artistic QR codes vs enterprise QR management with analytics and dynamic codes.",
    heroSubtitle:
      "Creative AI art generation vs enterprise QR tracking and analytics",
    introText:
      "QR Tiger is a full-featured enterprise QR code platform focused on dynamic QR codes, scan analytics, and team management. QRArtify serves a different need: transforming QR codes into AI-generated artwork. If you need scan tracking dashboards, QR Tiger is built for that. If you want QR codes that look like cyberpunk art, watercolor paintings, or nature scenes, QRArtify is your tool.",
    features: [
      {
        feature: "AI Art Generation",
        us: "Full AI-powered artistic style generation",
        them: "Template-based customization (colors, frames, patterns)",
      },
      {
        feature: "Dynamic QR Codes",
        us: "Static QR codes with artistic styling",
        them: "Full dynamic QR support — edit URL after printing",
      },
      {
        feature: "Scan Analytics",
        us: "Not available (art-focused tool)",
        them: "Comprehensive scan tracking, location, device data",
      },
      {
        feature: "Art Styles",
        us: "8+ AI styles: cyberpunk, watercolor, nature, neon, minimalist",
        them: "Frames and templates — no AI art generation",
      },
      {
        feature: "Team Management",
        us: "Individual creator tool",
        them: "Multi-user team features, SSO, role management",
      },
      {
        feature: "API Access",
        us: "Coming soon",
        them: "Full REST API for enterprise integration",
      },
      {
        feature: "Output Quality",
        us: "High-res AI-generated artwork",
        them: "Standard vector QR with customization",
      },
      {
        feature: "Free Tier",
        us: "3 AI art generations per day, no signup",
        them: "3 dynamic QR codes free, limited features",
      },
      {
        feature: "Price (Pro)",
        us: "$9.90/mo — unlimited AI art",
        them: "From $7/mo (Regular) to $37/mo (Advanced)",
      },
    ],
    ourAdvantages: [
      "AI generates truly artistic QR codes — not just colored templates",
      "Unique output every time — no two QR codes look alike",
      "Simpler pricing — one Pro plan covers everything",
      "Built for creators and designers who want visual impact",
      "No account required for free tier",
    ],
    theirAdvantages: [
      "Dynamic QR codes — edit destination URL after printing",
      "Comprehensive scan analytics and tracking",
      "Enterprise features: team management, SSO, API access",
      "Established platform with extensive integration ecosystem",
      "Bulk QR code generation for large campaigns",
    ],
    verdict:
      "Choose QRArtify if your QR codes need to be visually stunning — for creative marketing, premium packaging, art installations, and branded materials. Choose QR Tiger if you need enterprise QR management with dynamic codes, scan analytics, and team features.",
  },
};

/**
 * Pre-render all comparison pages at build time for optimal performance.
 * Static generation means these pages load instantly and score well on
 * Core Web Vitals — critical for SEO ranking.
 */
/**
 * Reject unknown slugs — Next.js returns 404 immediately without
 * invoking the page function. Prevents Vercel serverless hangs.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(competitors).map((slug) => ({ slug }));
}

/**
 * Dynamic metadata per competitor — ensures each comparison page has
 * unique, keyword-rich title and description for search engines.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = competitors[slug];
  if (!data) return {};
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: `${SITE_URL}/vs/${data.slug}` },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `${SITE_URL}/vs/${data.slug}`,
      type: "article",
      siteName: "QRArtify",
    },
    robots: { index: true, follow: true },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = competitors[slug];
  if (!data) notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5]">
      {/* Navigation */}
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
          <div className="flex items-center gap-4">
            <Link
              href="/vs"
              className="text-sm text-zinc-400 hover:text-white"
            >
              All Comparisons
            </Link>
            <Link
              href="/"
              className="rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white transition hover:from-purple-600 hover:to-fuchsia-700"
            >
              Try QRArtify Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-12">
          <Link
            href="/vs"
            className="mb-4 inline-block text-sm text-purple-400 hover:underline"
          >
            &larr; All Comparisons
          </Link>
          <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">
            QRArtify vs{" "}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-600 bg-clip-text text-transparent">
              {data.name}
            </span>
          </h1>
          <p className="text-lg text-zinc-400">{data.heroSubtitle}</p>
        </div>

        {/* Introduction */}
        <div className="mb-12 rounded-2xl border border-[#1e1e2e] bg-[#13131a] p-8">
          <p className="text-zinc-300 leading-relaxed">{data.introText}</p>
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Feature Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-[#1e1e2e]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1e1e2e] bg-[#13131a]">
                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-purple-400">
                    QRArtify
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">
                    {data.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.features.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={
                      i % 2 === 0 ? "bg-[#0a0a0f]" : "bg-[#13131a]/50"
                    }
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">
                      {row.us}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {row.them}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pros Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-8">
            <h3 className="mb-4 text-lg font-semibold text-purple-400">
              Why Choose QRArtify
            </h3>
            <ul className="space-y-3">
              {data.ourAdvantages.map((adv) => (
                <li key={adv} className="flex gap-3 text-sm text-zinc-300">
                  <span className="mt-0.5 text-purple-400">&#10003;</span>
                  {adv}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#1e1e2e] bg-[#13131a] p-8">
            <h3 className="mb-4 text-lg font-semibold text-zinc-400">
              Why Choose {data.name}
            </h3>
            <ul className="space-y-3">
              {data.theirAdvantages.map((adv) => (
                <li key={adv} className="flex gap-3 text-sm text-zinc-400">
                  <span className="mt-0.5">&#8226;</span>
                  {adv}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Verdict */}
        <div className="mb-12 rounded-2xl border border-[#1e1e2e] bg-[#13131a] p-8">
          <h2 className="mb-4 text-xl font-bold">The Verdict</h2>
          <p className="text-zinc-300 leading-relaxed">{data.verdict}</p>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-10 text-center">
          <h2 className="mb-3 text-2xl font-bold">
            Try QRArtify Free — No Signup Required
          </h2>
          <p className="mb-6 text-zinc-400">
            Generate up to 3 AI art QR codes per day. See the difference
            AI-powered art makes over basic QR customization.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-600 px-8 py-3 font-semibold text-white transition hover:from-purple-600 hover:to-fuchsia-700"
          >
            Generate QR Art Now
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
