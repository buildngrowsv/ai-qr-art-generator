/**
 * /blog — QRArtify Blog Listing Page
 *
 * PURPOSE:
 * SEO-optimized blog index featuring all published posts about AI QR art
 * generation, techniques, use cases, and comparisons. Drives organic traffic
 * via long-form content targeting informational and navigational queries.
 *
 * ARCHITECTURE:
 * - Lives outside [locale] so it does not go through next-intl routing.
 *   Root layout.tsx is a pass-through; [locale]/layout.tsx provides the
 *   real HTML shell. Blog pages render inside the pass-through, so they
 *   MUST NOT include html/body tags — they render as children of the
 *   locale layout's <main> element.
 * - Static generation at build time (no dynamic rendering needed).
 * - BreadcrumbList JSON-LD injected for Google rich results.
 *
 * STYLING: Matches the dark-theme violet/zinc palette of the vs/ pages.
 *
 * ADDED: 2026-04-15
 */

import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "./blog-posts";

const SITE_URL = "https://qrart.symplyai.io";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "QRArtify Blog — AI QR Art Guides, Tutorials & Use Cases",
  description:
    "Learn how AI QR art works, discover the best art styles for every context, and explore business use cases. In-depth guides from the QRArtify team.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "QRArtify Blog — AI QR Art Guides, Tutorials & Use Cases",
    description:
      "Learn how AI QR art works, discover the best art styles for every context, and explore business use cases.",
    url: `${SITE_URL}/blog`,
    type: "website",
    siteName: "QRArtify",
  },
  robots: { index: true, follow: true },
};

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: `${SITE_URL}/blog`,
    },
  ],
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

/** Category badge color map — violet shades for consistency with brand palette */
const CATEGORY_COLORS: Record<string, string> = {
  Explainer: "bg-violet-500/15 text-violet-300 border border-violet-500/20",
  Tutorial: "bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/20",
  Guide: "bg-purple-500/15 text-purple-300 border border-purple-500/20",
  Business: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20",
  Technical: "bg-blue-500/15 text-blue-300 border border-blue-500/20",
  Comparison: "bg-pink-500/15 text-pink-300 border border-pink-500/20",
};

function categoryBadge(category: string): string {
  return (
    CATEGORY_COLORS[category] ||
    "bg-zinc-700/40 text-zinc-300 border border-zinc-600/30"
  );
}

export default function BlogListingPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      {/* JSON-LD — BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5]">
        {/* ── Nav ── */}
        <nav className="border-b border-[#1e1e2e] px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link
              href="/"
              className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-600 bg-clip-text text-xl font-bold text-transparent"
            >
              QRArtify
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/blog" className="text-sm text-white font-medium">
                Blog
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
          {/* ── Hero ── */}
          <div className="mb-14 text-center">
            {/* Breadcrumb — visible */}
            <nav className="mb-6 flex justify-center gap-2 text-sm text-zinc-500">
              <Link href="/" className="hover:text-zinc-300 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-zinc-300">Blog</span>
            </nav>

            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              QRArtify{" "}
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-zinc-400">
              In-depth guides, tutorials, and use cases for AI QR art
              generation. Learn how to create stunning, scannable QR codes that
              people actually want to scan.
            </p>
          </div>

          {/* ── Post Grid ── */}
          <div className="mb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-[#1e1e2e] bg-[#13131a] p-6 transition hover:border-violet-500/40 hover:bg-[#16161f]"
              >
                {/* Category badge */}
                <span
                  className={`mb-3 inline-block self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryBadge(post.category)}`}
                >
                  {post.category}
                </span>

                {/* Title */}
                <h2 className="mb-3 text-base font-semibold leading-snug text-white group-hover:text-violet-300 transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-400">
                  {post.excerpt}
                </p>

                {/* Meta row */}
                <div className="mt-auto flex items-center justify-between text-xs text-zinc-600">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* ── CTA ── */}
          <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-10 text-center">
            <h2 className="mb-3 text-2xl font-bold">
              Ready to Create AI QR Art?
            </h2>
            <p className="mb-6 text-zinc-400">
              Generate 3 stunning AI QR codes per day — free, no signup
              required. See for yourself why visual QR codes get scanned more.
            </p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-600 px-8 py-3 font-semibold text-white transition hover:from-purple-600 hover:to-fuchsia-700"
            >
              Generate QR Art Now
            </Link>
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-[#1e1e2e] px-6 py-8 text-center text-sm text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} QRArtify.{" "}
            <a
              href="https://symplyai.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline"
            >
              Powered by SymplyAI
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
