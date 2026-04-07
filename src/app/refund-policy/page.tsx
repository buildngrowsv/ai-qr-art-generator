/**
 * refund-policy/page.tsx — Refund policy for QR Art AI.
 *
 * WHY THIS IS OUTSIDE [locale]:
 * Legal / compliance pages are placed at the root app level (not under
 * [locale]) so they are always accessible at /refund-policy without locale
 * middleware rewriting. The middleware matcher excludes "refund-policy" to
 * prevent next-intl from intercepting this route. This matches the pattern
 * used by /vs/ comparison pages.
 *
 * REQUIRED FOR: directory submissions (Toolify, There's an AI, etc.) and
 * Stripe compliance. All SymplyAI products must have a discoverable refund
 * policy page linked from the footer or legal section.
 */

export const metadata = {
  title: "Refund Policy | QR Art AI",
  description: "Refund policy for QR Art AI.",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0b1120] px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-3">
          <a href="/" className="text-sm text-amber-300 hover:text-amber-200">
            Back to QR Art AI
          </a>
          <h1 className="text-4xl font-bold">Refund Policy</h1>
          <p className="text-sm text-slate-400">Last updated: 2026-04-06</p>
        </div>
        <p className="text-slate-300">
          If you were charged in error or want to request a refund, email{" "}
          <a
            className="text-amber-300 hover:text-amber-200"
            href="mailto:support@symplyai.io"
          >
            support@symplyai.io
          </a>{" "}
          with your Stripe receipt and account details.
        </p>
        <section className="space-y-3 text-slate-300">
          <p>
            First-time subscription charges requested within 7 days are reviewed
            for refund eligibility.
          </p>
          <p>
            Duplicate charges and obvious billing mistakes are corrected
            promptly.
          </p>
          <p>
            Refunds may be denied after substantial usage or repeated renewals
            except where required by law.
          </p>
        </section>
      </div>
    </main>
  );
}
