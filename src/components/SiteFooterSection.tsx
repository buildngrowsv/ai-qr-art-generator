/**
 * SiteFooterSection.tsx — Global footer shown on all pages
 *
 * PRODUCT CONTEXT: The footer provides:
 *   1. Legal links (Privacy, Terms) — required for Stripe and App Store compliance
 *   2. Navigation redundancy — users who scroll to bottom can still navigate
 *   3. Brand reinforcement — logo and tagline
 *   4. Social proof potential (social links placeholder for post-launch)
 *
 * DESIGN: Minimal dark footer that doesn't distract from the main content.
 * We keep it simple in v1 and expand post-launch with social links, blog, etc.
 *
 * CALLED BY: src/app/layout.tsx (included on every page)
 */

import Link from "next/link";

export default function SiteFooterSection() {
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/*
           * Brand column — reinforces what the product is and who it's for.
           * The tagline "Transform any URL into stunning QR code art" is the
           * core value proposition in one sentence.
           */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
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
                </svg>
              </div>
              <span className="font-bold">QR Art AI</span>
            </div>
            <p className="text-sm text-zinc-500 max-w-xs">
              Transform any URL into stunning QR code art using AI. Beautiful, scannable, and unique.
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-300">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  Generate QR Art
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal links — required for Stripe compliance */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-300">Legal</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-zinc-500">
                  Privacy Policy (coming soon)
                </span>
              </li>
              <li>
                <span className="text-sm text-zinc-500">
                  Terms of Service (coming soon)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-sm text-zinc-600 text-center">
            &copy; {new Date().getFullYear()} QR Art AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
