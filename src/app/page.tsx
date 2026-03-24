/**
 * page.tsx — Landing page for QR Art AI
 *
 * PRODUCT CONTEXT: This is the FIRST thing users see. It must accomplish:
 *   1. Immediately communicate what the product does (QR code + AI + art)
 *   2. Show stunning visual examples to prove quality (gradient placeholders in v1)
 *   3. Present pricing transparently to pre-qualify buyers
 *   4. Drive users to the dashboard to start generating
 *
 * PAGE STRUCTURE (follows classic SaaS landing page formula):
 *   1. Hero — Big headline + subheadline + CTA button + visual preview
 *   2. Stats / trust signals
 *   3. Features — key differentiators with icons
 *   4. How It Works — 3-step process to demystify the product
 *   5. Use Cases — show breadth of applicability
 *   6. Pricing — Embedded pricing cards (reused component)
 *   7. Final CTA — One more push to convert
 *
 * DESIGN: Dark gradient backgrounds, animated gradient text, subtle glass effects.
 * Inspired by Linear, Vercel, and Arc browser landing pages — premium SaaS aesthetic.
 *
 * SEO: This page targets "AI QR code art generator" and related keywords.
 * The content is structured with proper heading hierarchy for search engines.
 *
 * QR Art AI is a web-first SaaS tool in the AI QR Code Art category (~15 tools
 * on Toolify, low competition). Competitors: QR Code AI Art, QRBTF, Hovercode.
 * Our wedge: faster generation, better style control, more affordable pricing.
 */

import Link from "next/link";
import PricingTierCards from "@/components/PricingTierCards";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* ================================================================
       * SECTION 1: HERO
       * The hero is the most critical section — 8 seconds to capture attention.
       * Big gradient headline + clear value prop + immediate CTA.
       * ================================================================ */}
      <section className="gradient-hero-background relative overflow-hidden">
        {/*
         * Decorative gradient orbs — positioned absolutely behind the content.
         * These create depth and visual interest. They're purely decorative
         * but make the page feel premium and "designed" rather than generic.
         */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 text-center">
          {/*
           * Announcement badge — shows product is live and evolving.
           * Green pulse dot signals "online/active".
           */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-purple-300">
              AI-Powered QR Art Generator
            </span>
          </div>

          {/*
           * Main headline — uses animated gradient text for maximum visual impact.
           * Formula: [Action] + [Object] + [Benefit]
           * "Transform Any URL Into Stunning QR Code Art"
           * We lead with TRANSFORMATION because that's the emotional hook.
           * Competitors lead with "generate QR codes" which is functional but not exciting.
           */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
            Transform Any URL Into{" "}
            <span className="gradient-text-animated">
              Stunning QR Code Art
            </span>
          </h1>

          {/*
           * Subheadline — explains the "how" and removes doubt.
           * Emphasizes: AI-powered, scannable, seconds (fast), free to start (low risk).
           */}
          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Create beautiful, scannable QR codes powered by AI. Choose from dozens of art styles,
            customize with prompts, and download in seconds. Every code guaranteed scannable.
          </p>

          {/*
           * CTA buttons — primary and secondary.
           *   - "Try Free - No Sign Up" — removes payment AND signup anxiety
           *   - "View Pricing" — for price-sensitive users who want to evaluate first
           */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-105"
            >
              Try Free — No Sign Up
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 rounded-xl font-semibold text-base border border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all"
            >
              View Pricing
            </Link>
          </div>

          {/*
           * Social proof stats — even before we have real user data, showing
           * capability stats builds confidence. "100% Scannable" is our
           * strongest claim because it addresses the #1 fear users have.
           */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
            {[
              { value: "100%", label: "Scannable" },
              { value: "<30s", label: "Generation Time" },
              { value: "50+", label: "Art Styles" },
              { value: "4K", label: "Resolution" },
            ].map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-8">
                {index > 0 && <div className="hidden sm:block h-12 w-px bg-white/10" />}
                <div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/*
           * Preview area — shows example QR art styles to demonstrate quality.
           * Uses gradient placeholders since we don't have pre-generated
           * example images yet. Post-launch, replace with real generated examples.
           */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { styleLabel: "Cyberpunk", gradientColors: "from-violet-600 to-cyan-500" },
              { styleLabel: "Japanese Garden", gradientColors: "from-pink-400 to-green-400" },
              { styleLabel: "Ocean Waves", gradientColors: "from-blue-600 to-amber-400" },
              { styleLabel: "Galaxy", gradientColors: "from-purple-800 to-pink-500" },
            ].map((example) => (
              <div
                key={example.styleLabel}
                className="aspect-square rounded-2xl border border-white/10 overflow-hidden relative group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${example.gradientColors} opacity-40 group-hover:opacity-60 transition-opacity`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="text-white/30 group-hover:text-white/50 transition-colors"
                  >
                    <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
                    <rect x="11" y="1" width="6" height="6" rx="1" fill="currentColor" />
                    <rect x="1" y="11" width="6" height="6" rx="1" fill="currentColor" />
                    <rect x="11" y="11" width="3" height="3" rx="0.5" fill="currentColor" />
                    <rect x="14" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-xs text-white font-medium">{example.styleLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
       * SECTION 2: FEATURES
       * Each feature addresses a common pain point with existing QR generators.
       * ================================================================ */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Why Choose{" "}
              <span className="gradient-text-animated">QR Art AI</span>
            </h2>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
              The only QR generator that makes art — not just codes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Always Scannable",
                description:
                  "Our AI ensures every QR code art piece is fully functional. Beautiful doesn't mean broken — every creation scans perfectly with any smartphone camera.",
                iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Generate in Seconds",
                description:
                  "No design skills needed. Enter a URL, pick a style, and get stunning QR art in 10-20 seconds. What used to take hours in Photoshop now takes seconds.",
                iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
              },
              {
                title: "Unlimited Creativity",
                description:
                  "Choose from curated style presets or write custom prompts. Cyberpunk, watercolor, galaxy — if you can describe it, we can create it.",
                iconPath:
                  "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
              },
              {
                title: "High Resolution",
                description:
                  "Download in up to 4K resolution. Perfect for print materials, posters, business cards, and merchandise.",
                iconPath: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
              },
              {
                title: "Custom Branding",
                description:
                  "Match your brand aesthetic. Use custom prompts to incorporate your brand colors, themes, and visual identity into every QR code.",
                iconPath: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
              },
              {
                title: "Unlimited Variations",
                description:
                  "Not happy with the first result? Regenerate with one click. Each generation creates a unique variation of your QR art.",
                iconPath: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] card-glow-on-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-5">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.iconPath} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
       * SECTION 3: HOW IT WORKS
       * 3-step process to demystify the product and reduce anxiety.
       * ================================================================ */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Three Steps to{" "}
              <span className="gradient-text-animated">Beautiful QR Art</span>
            </h2>
            <p className="mt-4 text-zinc-400">From URL to artwork in under a minute</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                stepNumber: "01",
                title: "Enter Your URL",
                description: "Paste any URL — your website, social profile, portfolio, or any link you want to share.",
              },
              {
                stepNumber: "02",
                title: "Choose a Style",
                description: "Pick from curated presets like Cyberpunk, Japanese Garden, or Galaxy — or write your own creative prompt.",
              },
              {
                stepNumber: "03",
                title: "Download & Share",
                description: "Get your AI-generated QR art in seconds. Download as PNG and use it anywhere — print, digital, social media.",
              },
            ].map((step) => (
              <div key={step.stepNumber} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/20 mb-6">
                  <span className="text-2xl font-bold gradient-text-animated">{step.stepNumber}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
       * SECTION 4: USE CASES
       * Show breadth of applicability to capture different user segments.
       * ================================================================ */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Perfect For Every <span className="gradient-text-animated">Use Case</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { useCase: "Marketing Campaigns", description: "Stand out in print ads, flyers, and billboards with QR codes people actually want to scan.", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
              { useCase: "Business Cards", description: "Replace boring QR codes with artistic ones that match your brand and make a lasting impression.", icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" },
              { useCase: "Events & Conferences", description: "Create memorable event badges, posters, and materials with scannable art that drives engagement.", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
              { useCase: "Social Media", description: "Share beautiful QR art that links to your profiles, driving followers from any platform.", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
            ].map((item) => (
              <div
                key={item.useCase}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] card-glow-on-hover"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">{item.useCase}</h3>
                <p className="text-sm text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
       * SECTION 5: PRICING
       * Uses the shared PricingTierCards component for consistency.
       * ================================================================ */}
      <section id="pricing" className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Simple, <span className="gradient-text-animated">Transparent</span> Pricing
            </h2>
            <p className="mt-4 text-zinc-400">Start free, upgrade when you need more. No hidden fees.</p>
          </div>

          <PricingTierCards />
        </div>
      </section>

      {/* ================================================================
       * SECTION 6: FINAL CTA
       * Last chance to convert. Repeats core value prop.
       * ================================================================ */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Create <span className="gradient-text-animated">Something Beautiful?</span>
          </h2>
          <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
            Join creators, marketers, and businesses using AI to transform ordinary QR codes into works of art.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex px-10 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
          >
            Start Creating — It&apos;s Free
          </Link>
        </div>
      </section>
    </div>
  );
}
