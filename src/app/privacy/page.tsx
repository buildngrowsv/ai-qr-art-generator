import type { Metadata } from "next";
import Link from "next/link";

const PRODUCT_NAME = "AI QR Art Generator";
const siteUrl = "https://qrart.symplyai.io";

export const metadata: Metadata = {
  title: `Privacy Policy | ${PRODUCT_NAME}`,
  description: `Privacy policy for ${PRODUCT_NAME}.`,
  openGraph: {
    title: `Privacy Policy | ${PRODUCT_NAME}`,
    description: `Privacy policy for ${PRODUCT_NAME}.`,
    url: `${siteUrl}/privacy`,
    type: "website",
    siteName: "QR Art AI",
  },
  alternates: { canonical: `${siteUrl}/privacy` },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Privacy Policy</p>
          <h1 className="text-4xl font-semibold tracking-tight">{PRODUCT_NAME} privacy policy</h1>
          <p className="max-w-2xl text-base text-slate-300">
            This policy explains what data {PRODUCT_NAME} collects, how it is used,
            and the choices you have.
          </p>
        </div>

        <div className="space-y-8 text-sm leading-7 text-slate-300">
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Last updated April 2026</p>
            <h2 className="text-xl font-medium text-white">1. Information we collect</h2>
            <p>
              We collect information you provide directly (account details, uploaded
              content) and data generated automatically (usage analytics, device info,
              IP address). We use Google Analytics 4 for anonymized site analytics.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">2. How we use your data</h2>
            <p>
              Your data is used to provide and improve the service, process payments
              via Stripe, generate AI outputs through our API providers, and communicate
              service updates.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">3. Data processors</h2>
            <p>
              We use the following third-party processors: Stripe (payments), fal.ai
              (AI generation), Google Analytics (analytics), and our authentication
              provider. Each processor has its own privacy policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">4. Data retention and deletion</h2>
            <p>
              Account data is retained while your account is active. You may request
              deletion of your data by contacting support. Generated content may be
              cached temporarily for performance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">5. Cookies</h2>
            <p>
              We use essential cookies for authentication and optional analytics
              cookies (Google Analytics). You can manage cookie preferences through
              the consent banner.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">6. Contact</h2>
            <p>
              For privacy questions, contact us through the support channels listed
              on the main site.
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
