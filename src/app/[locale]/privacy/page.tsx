/**
 * /privacy — Privacy Policy for AI QR Art Generator.
 *
 * WHY THIS EXISTS (compliance fix, 2026-04-07):
 * Directory submissions require a privacy policy that names all data
 * processors. This page was missing — blocking submissions.
 */
import type { Metadata } from "next";

const siteUrl = "https://qrart.symplyai.io";

export const metadata: Metadata = {
  title: "Privacy Policy | AI QR Art Generator",
  description: "Privacy policy for AI QR Art Generator — how we handle your data.",
  openGraph: {
    title: "Privacy Policy | AI QR Art Generator",
    description: "Privacy policy for AI QR Art Generator — how we handle your data.",
    url: `${siteUrl}/privacy`,
    type: "website",
    siteName: "QR Art AI",
  },
  alternates: { canonical: `${siteUrl}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: April 7, 2026
        </p>

        <div className="prose prose-invert max-w-none space-y-6 text-sm text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. What we collect</h2>
            <p>
              When you use AI QR Art Generator, we collect: QR code data and style preferences (processed server-side and not stored after generation),
              usage analytics (page views, feature usage via Google Analytics 4),
              and payment information (processed by Stripe — we never see your
              full card number).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Data processors</h2>
            <p>We use the following third-party services to operate:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Google Analytics 4 (GA4)</strong> — anonymous usage
                analytics. Consent mode defaults to denied; analytics cookies
                only activate after you accept the cookie banner.
              </li>
              <li>
                <strong>Stripe</strong> — payment processing for Pro
                subscriptions and credit packs. Stripe&apos;s privacy policy
                applies to payment data.
              </li>
              <li>
                <strong>fal.ai</strong> — AI image generation. Uploaded images
                are sent to fal.ai for processing and are not retained after
                generation completes.
              </li>
              <li>
                <strong>Vercel</strong> — hosting and CDN. Standard server logs
                (IP, user agent) are retained per Vercel&apos;s data policy.
              </li>
              <li>
                <strong>Cloudflare</strong> — DNS and edge security. Standard
                request metadata is processed per Cloudflare&apos;s privacy policy.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Cookies</h2>
            <p>
              We use essential cookies for site functionality and optional
              analytics cookies (GA4) that require your consent. You can
              withdraw consent at any time by clearing your browser cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Your rights</h2>
            <p>
              You may request access to, correction of, or deletion of your
              personal data at any time by contacting us. If you are in the
              EU/EEA, you have rights under GDPR including data portability
              and the right to lodge a complaint with a supervisory authority.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Data retention</h2>
            <p>
              Uploaded images are processed in real-time and not stored after
              generation. Analytics data is retained for 14 months (GA4
              default). Payment records are retained as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Contact</h2>
            <p>
              For privacy questions or data requests, email{" "}
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
