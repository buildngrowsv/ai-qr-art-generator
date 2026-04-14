/**
 * Checkout Success Page — /checkout/success
 *
 * WHY THIS PAGE EXISTS:
 * After completing Stripe checkout, users are redirected here. This is a
 * critical conversion moment — the user just paid money and needs:
 * 1. Confirmation their payment worked (reduces refund/chargeback anxiety)
 * 2. Clear next step to start using the product (drives activation)
 * 3. GA4 purchase event firing (tracks revenue attribution)
 *
 * Without this page, users land on a dashboard with no acknowledgment of
 * their purchase, which feels broken and increases support tickets.
 *
 * STRIPE FLOW:
 * checkout/route.ts sets success_url to /checkout/success?session_id={CHECKOUT_SESSION_ID}
 * The session_id can be used server-side to verify the purchase if needed.
 *
 * NOTE: This version uses no external icon dependencies (no lucide-react)
 * so it works in every clone regardless of installed packages.
 *
 * Synced from saas-clone-template (nexus-strat-7439, 2026-04-14).
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your payment was successful. Start using your Pro features now.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <div className="mx-auto max-w-lg text-center">
        {/* Success icon */}
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20">
          <svg
            className="h-10 w-10 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Payment Successful!
        </h1>

        <p className="mb-2 text-lg text-zinc-300">
          Your Pro plan is now active. You have full access to all features.
        </p>

        <p className="mb-8 text-sm text-zinc-500">
          A confirmation email will arrive shortly. Your credits have been added
          to your account automatically.
        </p>

        {/* Primary CTA — drive activation */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-600/25 transition hover:from-purple-500 hover:to-purple-400"
          >
            Start Creating →
          </Link>

          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-6 py-3 font-medium text-zinc-400 transition hover:border-purple-500/30 hover:text-white"
          >
            View Your Plan
          </Link>
        </div>

        {/* Trust reinforcement */}
        <div className="mt-10 rounded-xl border border-white/5 bg-zinc-900 p-4">
          <h2 className="mb-2 text-sm font-semibold text-zinc-300">
            What happens next?
          </h2>
          <ul className="space-y-1.5 text-left text-sm text-zinc-500">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-400">&#x2713;</span>
              <span>Your Pro credits are already in your account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-400">&#x2713;</span>
              <span>All rate limits have been removed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-400">&#x2713;</span>
              <span>Credits refresh automatically each billing cycle</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-400">&#x2713;</span>
              <span>Cancel anytime from your account settings</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
