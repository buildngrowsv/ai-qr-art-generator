/**
 * SiteHeaderNavigation.tsx — Top navigation bar shown on all pages
 *
 * PRODUCT CONTEXT: The header is the primary navigation element and also serves as
 * a branding touchpoint. It must:
 *   1. Show the brand name and logo prominently
 *   2. Provide clear navigation to key pages (Dashboard, Pricing)
 *   3. Include a strong CTA ("Start Creating") to drive conversions
 *   4. Be responsive — works on mobile (hamburger) and desktop (inline links)
 *
 * DESIGN DECISIONS:
 *   - Sticky/fixed header with backdrop blur — modern SaaS standard (Linear, Vercel)
 *   - Semi-transparent background so content peeks through — adds depth
 *   - CTA button uses the brand gradient — draws the eye and matches overall aesthetic
 *   - Mobile: simplified to just logo + CTA (nav links accessible via hamburger if needed)
 *
 * CALLED BY: src/app/layout.tsx (included on every page)
 */

import Link from "next/link";

export default function SiteHeaderNavigation() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{
        /*
         * Backdrop blur with semi-transparent dark background.
         * This creates the "frosted glass" effect popular in modern SaaS UIs.
         * We use inline style for the backdrop-filter to ensure it applies
         * correctly across all browsers (Tailwind's backdrop-blur sometimes
         * has specificity issues with fixed positioning).
         */
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(10, 10, 15, 0.8)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/*
         * Brand mark — the app name with a gradient accent.
         * "QR Art AI" is short, memorable, and describes exactly what the product does.
         * The gradient on "Art" reinforces the creative/artistic value proposition.
         */}
        <Link href="/" className="flex items-center gap-2 group">
          {/*
           * QR code icon — a simple SVG that represents the product.
           * We use a custom SVG rather than an icon library to minimize bundle size
           * and ensure the icon perfectly matches our brand aesthetic.
           */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center transition-transform group-hover:scale-110">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="11" y="1" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="1" y="11" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="11" y="11" width="3" height="3" rx="0.5" fill="currentColor" />
              <rect x="14" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
              <rect x="11" y="14" width="3" height="1.5" rx="0.5" fill="currentColor" opacity="0.5" />
            </svg>
          </div>
          <span className="text-xl font-bold">
            QR <span className="gradient-text-animated">Art</span> AI
          </span>
        </Link>

        {/*
         * Navigation links — desktop only (hidden on mobile to save space).
         * We keep nav simple: Dashboard (the product) and Pricing (the conversion page).
         * More links can be added post-launch (Blog, Docs, API, etc.).
         */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Pricing
          </Link>

          {/*
           * Primary CTA button — drives users to the generate page.
           * Uses the brand gradient and a subtle hover effect.
           * The text "Start Creating" emphasizes the creative/action orientation
           * rather than the more generic "Get Started" or "Sign Up".
           */}
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all hover:shadow-lg hover:shadow-purple-500/25"
          >
            Start Creating
          </Link>
        </div>

        {/*
         * Mobile CTA — always visible on small screens.
         * On mobile, we skip the nav links and just show the CTA.
         * Users can navigate via the landing page sections.
         */}
        <Link
          href="/dashboard"
          className="md:hidden px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
        >
          Create
        </Link>
      </nav>
    </header>
  );
}
