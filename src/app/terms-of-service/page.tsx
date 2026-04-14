import type { Metadata } from "next";
import Link from "next/link";

const PRODUCT_NAME = "AI QR Art Generator";

export const metadata: Metadata = {
  title: `Terms of Service | ${PRODUCT_NAME}`,
  description: `Terms of service for ${PRODUCT_NAME}.`,
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Terms of Service</p>
          <h1 className="text-4xl font-semibold tracking-tight">{PRODUCT_NAME} terms of service</h1>
          <p className="max-w-2xl text-base text-slate-300">
            These terms govern access to {PRODUCT_NAME}, including use of the web app,
            paid plans, and related support channels.
          </p>
        </div>

        <div className="space-y-8 text-sm leading-7 text-slate-300">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Last updated April 2026</p>
            <h2 className="text-xl font-medium text-white">1. Acceptance</h2>
            <p>
              By using {PRODUCT_NAME}, you agree to these terms and to any additional
              policies referenced from the product.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">2. Accounts and access</h2>
            <p>
              You are responsible for maintaining the security of your account and for
              all activity that occurs through your credentials. We may suspend access
              for abuse, fraud, or violations of these terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">3. Paid plans and credits</h2>
            <p>
              Paid plans, usage credits, and feature limits are described in the product
              pricing surface. Access to paid features may be suspended if payment fails,
              is disputed, or is reversed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">4. AI-generated content</h2>
            <p>
              Content generated through {PRODUCT_NAME} is provided as-is. You retain
              rights to your input content. Generated outputs may be used for your
              personal and commercial purposes subject to applicable laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">5. Acceptable use</h2>
            <p>
              You may not use the service for unlawful, abusive, fraudulent, or harmful
              activity, including attempts to evade billing, rate limits, or platform
              safeguards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">6. Contact</h2>
            <p>
              Questions about these terms can be directed through the support channels
              listed on the main site.
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link className="text-sm text-cyan-300 hover:text-cyan-200" href="/">Back to home</Link>
        </div>
      </div>
    </main>
  );
}
