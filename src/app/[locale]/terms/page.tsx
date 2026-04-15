/**
 * /terms — Terms of Service for AI QR Art Generator.
 *
 * WHY THIS EXISTS (compliance fix, 2026-04-07):
 * Directory submissions require a terms page. Creates legal compliance
 * baseline for the product.
 */
import type { Metadata } from "next";

const siteUrl = "https://qrart.symplyai.io";

export const metadata: Metadata = {
  title: "Terms of Service | AI QR Art Generator",
  description: "Terms of service for AI QR Art Generator.",
  openGraph: {
    title: "Terms of Service | AI QR Art Generator",
    description: "Terms of service for AI QR Art Generator.",
    url: `${siteUrl}/terms`,
    type: "website",
    siteName: "QR Art AI",
  },
  alternates: { canonical: `${siteUrl}/terms` },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: April 7, 2026
        </p>

        <div className="prose prose-invert max-w-none space-y-6 text-sm text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Acceptance</h2>
            <p>
              By using AI QR Art Generator (&quot;the Service&quot;), you agree
              to these terms. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Service description</h2>
            <p>
              AI QR Art Generator creates artistic, stylized QR codes from your URLs and text using AI models. The Service is provided &quot;as is&quot;
              with no guarantee of specific output quality or style accuracy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Upload images you do not have rights to use</li>
              <li>Generate content depicting minors inappropriately</li>
              <li>Use outputs for harassment, defamation, or illegal purposes</li>
              <li>Attempt to bypass rate limits or security measures</li>
              <li>Resell API access or bulk-generate for third-party services without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Intellectual property</h2>
            <p>
              You retain rights to your uploaded images. Generated outputs are
              licensed to you for personal and commercial use. We do not claim
              ownership of your generated content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Payments and refunds</h2>
            <p>
              Pro subscriptions and credit packs are processed by Stripe. Refund
              requests within 7 days of purchase are handled on a case-by-case
              basis. Contact support@symplyai.io for refund requests.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Limitation of liability</h2>
            <p>
              The Service is provided without warranties of any kind. We are not
              liable for any indirect, incidental, or consequential damages
              arising from your use of the Service. Our total liability is
              limited to the amount you paid in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Contact</h2>
            <p>
              Questions about these terms? Email{" "}
              <a
                href="mailto:support@symplyai.io"
                className="text-primary hover:underline"
              >
                support@symplyai.io
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
