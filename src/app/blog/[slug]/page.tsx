/**
 * /blog/[slug] — QRArtify Individual Blog Post Page
 *
 * PURPOSE:
 * Renders a single blog post with full Article, FAQPage, and BreadcrumbList
 * JSON-LD structured data for maximum Google rich result eligibility.
 *
 * ARCHITECTURE:
 * - dynamicParams = false: unknown slugs return 404 immediately, preventing
 *   Vercel serverless hangs on invalid URLs (Gate 12 / pSEO pattern).
 * - generateStaticParams: pre-renders all posts at build time for optimal
 *   Core Web Vitals and zero cold-start latency.
 * - generateMetadata: unique per-post title, description, canonical, and OG.
 * - params: Promise<{ slug: string }> — MUST be awaited (Next.js 15+).
 * - No html/body tags — root layout.tsx passes through to [locale]/layout.tsx.
 *
 * STYLING: Dark violet/zinc palette consistent with vs/ and blog listing pages.
 *
 * ADDED: 2026-04-15
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedPosts,
} from "../blog-posts";

const SITE_URL = "https://qrart.symplyai.io";

// ---------------------------------------------------------------------------
// Static params + params guard
// ---------------------------------------------------------------------------

/**
 * Reject unknown slugs immediately — returns HTTP 404 without invoking the
 * page component. Prevents serverless function hangs on garbage URLs.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      siteName: "QRArtify",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
    robots: { index: true, follow: true },
  };
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post, 3);

  // ── JSON-LD: Article ──────────────────────────────────────────────────────
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: "QRArtify",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "QRArtify",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  // ── JSON-LD: FAQPage ──────────────────────────────────────────────────────
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // ── JSON-LD: BreadcrumbList ───────────────────────────────────────────────
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
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD structured data — injected in component body; Next.js RSC
          renders these into the SSR HTML output so Googlebot can read them. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5]">
        {/* ── Nav ── */}
        <nav className="border-b border-[#1e1e2e] px-6 py-4">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <Link
              href="/"
              className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-600 bg-clip-text text-xl font-bold text-transparent"
            >
              QRArtify
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/blog"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                All Posts
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

        <main className="mx-auto max-w-3xl px-6 py-16">
          {/* ── Breadcrumb — visible ── */}
          <nav className="mb-8 flex gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/blog"
              className="hover:text-zinc-300 transition-colors"
            >
              Blog
            </Link>
            <span>/</span>
            <span className="text-zinc-400 truncate max-w-[200px]">
              {post.title}
            </span>
          </nav>

          {/* ── Article Header ── */}
          <header className="mb-12">
            {/* Category badge */}
            <span className="mb-4 inline-block rounded-full bg-violet-500/15 border border-violet-500/20 px-3 py-0.5 text-xs font-medium text-violet-300">
              {post.category}
            </span>

            <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
              <span>By QRArtify Team</span>
              <span>·</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>

            {/* Excerpt callout */}
            <div className="mt-8 rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
              <p className="text-zinc-300 leading-relaxed">{post.excerpt}</p>
            </div>
          </header>

          {/* ── Article Body ── */}
          <article className="mb-16 space-y-10">
            {post.sections.map((section, idx) => (
              <section key={idx}>
                <h2 className="mb-3 text-xl font-semibold text-white">
                  {section.heading}
                </h2>
                <p className="leading-relaxed text-zinc-300">{section.body}</p>
              </section>
            ))}
          </article>

          {/* ── FAQ Section ── */}
          {post.faqs.length > 0 && (
            <section className="mb-16">
              <h2 className="mb-6 text-2xl font-bold">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {post.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#1e1e2e] bg-[#13131a] p-6"
                  >
                    <h3 className="mb-2 font-semibold text-white">
                      {faq.question}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── CTA ── */}
          <div className="mb-16 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-8 text-center">
            <h2 className="mb-2 text-xl font-bold">
              Ready to Create AI QR Art?
            </h2>
            <p className="mb-5 text-sm text-zinc-400">
              Generate 3 stunning AI QR codes per day — free, no signup
              required.
            </p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-600 px-7 py-3 font-semibold text-white transition hover:from-purple-600 hover:to-fuchsia-700"
            >
              Generate QR Art Now
            </Link>
          </div>

          {/* ── Related Posts ── */}
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="mb-6 text-xl font-bold">Related Articles</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group rounded-xl border border-[#1e1e2e] bg-[#13131a] p-5 transition hover:border-violet-500/40"
                  >
                    <span className="mb-2 block text-xs text-zinc-500">
                      {related.category}
                    </span>
                    <h3 className="mb-2 text-sm font-semibold leading-snug text-white group-hover:text-violet-300 transition-colors">
                      {related.title}
                    </h3>
                    <span className="text-xs text-zinc-600">
                      {related.readTime}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
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
