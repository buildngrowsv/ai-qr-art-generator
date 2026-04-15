import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — QR Art AI",
  description:
    "Get in touch with the QR Art AI team. We\'re here to help with questions, feedback, and support.",
  alternates: {
    canonical: "https://qrart.symplyai.io/contact",
  },
  openGraph: {
    title: "Contact Us — QR Art AI",
    description: "Get in touch with the QR Art AI team.",
    type: "website",
    url: "https://qrart.symplyai.io/contact",
  },
};

/**
 * Contact page — provides a way for users to reach the team.
 * Linked from Organization JSON-LD contactPoint and footer navigation.
 * Part of SymplyAI portfolio.
 */
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-white">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="mb-8 text-lg text-zinc-400">
          Have a question, feedback, or need support? We&apos;d love to hear
          from you.
        </p>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-2 text-xl font-semibold">Email Support</h2>
            <p className="mb-4 text-zinc-400">
              For questions, bug reports, or feature requests, email us
              directly:
            </p>
            <a
              href="mailto:support@symplyai.io"
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 font-medium text-white transition hover:bg-violet-500"
            >
              support@symplyai.io
            </a>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-2 text-xl font-semibold">Response Time</h2>
            <p className="text-zinc-400">
              We typically respond within 24 hours during business days. For
              urgent billing issues, please include your account email in the
              subject line.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-2 text-xl font-semibold">About QR Art AI</h2>
            <p className="text-zinc-400">
              QR Art AI is part of the 
              <a
                href="https://symplyai.io"
                className="text-violet-400 underline hover:text-violet-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                SymplyAI
              </a> 
              portfolio of AI-powered tools.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
