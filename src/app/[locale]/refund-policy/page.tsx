import type { Metadata } from "next";

const siteUrl = "https://qrart.symplyai.io";

export const metadata: Metadata = {
  title: "Refund Policy | AI QR Art Generator",
  description: "Refund policy for AI QR Art Generator.",
  openGraph: {
    title: "Refund Policy | AI QR Art Generator",
    description: "Refund policy for AI QR Art Generator.",
    url: `${siteUrl}/refund-policy`,
    type: "website",
    siteName: "QR Art AI",
  },
  alternates: { canonical: `${siteUrl}/refund-policy` },
};

/**
 * Refund policy page — required for directory submissions (SaaSHub, AlternativeTo, etc.)
 * and GDPR/consumer-protection compliance. Covers credit-based AI generation products
 * where third-party API costs are non-recoverable once consumed.
 */
export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-3xl space-y-6">
        <a href="/" className="text-sm text-violet-500 hover:text-violet-400">
          &larr; Back to AI Qr Art Generator
        </a>
        <h1 className="text-4xl font-bold">Refund Policy</h1>
        <p className="text-muted-foreground">Last updated: April 2026</p>

        <h2 className="text-2xl font-semibold">Eligibility</h2>
        <p>
          If checkout succeeds but the paid service is not delivered as described,
          contact{" "}
          <a
            className="text-violet-500 hover:text-violet-400"
            href="mailto:support@symplyai.io"
          >
            support@symplyai.io
          </a>{" "}
          within 14 days with your receipt.
        </p>

        <h2 className="text-2xl font-semibold">Processing</h2>
        <p>
          We will review your request and, if eligible, issue a full refund to
          your original payment method within 5–10 business days.
        </p>

        <h2 className="text-2xl font-semibold">Non-Refundable Items</h2>
        <p>
          Refunds are not available for credits that have already been used for
          AI generation, as these incur third-party API costs that cannot be
          recovered.
        </p>

        <h2 className="text-2xl font-semibold">Contact</h2>
        <p>
          For questions about this policy, email{" "}
          <a
            className="text-violet-500 hover:text-violet-400"
            href="mailto:support@symplyai.io"
          >
            support@symplyai.io
          </a>
          .
        </p>
      </div>
    </main>
  );
}
