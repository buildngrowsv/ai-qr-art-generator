import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — QR Art AI",
  description:
    "Learn about QR Art AI, an AI-powered tool built by SymplyAI. creates artistic, scannable QR codes with custom designs and embedded images usi.",
  alternates: {
    canonical: "https://qrart.symplyai.io/about",
  },
  openGraph: {
    title: "About — QR Art AI",
    description: "Learn about QR Art AI, built by SymplyAI.",
    type: "website",
    url: "https://qrart.symplyai.io/about",
  },
};

/**
 * About page — product overview, SymplyAI attribution, and contact info.
 * Supports E-E-A-T signals and Organization JSON-LD credibility.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-white">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <a
          href="/"
          className="mb-6 inline-block text-sm text-violet-400 transition hover:text-violet-300"
        >
          &larr; Back to QR Art AI
        </a>

        <h1 className="mb-6 text-4xl font-bold tracking-tight">
          About QR Art AI
        </h1>

        <p className="mb-10 text-lg leading-relaxed text-zinc-300">
          QR Art AI creates artistic, scannable QR codes with custom designs and embedded images using AI. Powered by state-of-the-art AI models,
          it delivers high-quality results in seconds — no technical expertise
          required.
        </p>

        <div className="space-y-8">
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-3 text-2xl font-semibold">Built by SymplyAI</h2>
            <p className="leading-relaxed text-zinc-300">
              QR Art AI is built and maintained by{" "}
              <a
                href="https://symplyai.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 underline transition hover:text-violet-300"
              >
                SymplyAI
              </a>
              , a portfolio of AI-powered creative tools designed to make
              professional-quality content accessible to everyone.
            </p>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-3 text-2xl font-semibold">Our Mission</h2>
            <p className="leading-relaxed text-zinc-300">
              We believe powerful AI tools should be simple, affordable, and
              available to everyone — from individual creators and small
              businesses to enterprise teams. Every tool in the SymplyAI
              portfolio is designed with this principle in mind.
            </p>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-3 text-2xl font-semibold">Contact</h2>
            <p className="leading-relaxed text-zinc-300">
              Questions, feedback, or partnership inquiries? Reach us at{" "}
              <a
                href="mailto:support@symplyai.io"
                className="text-violet-400 underline transition hover:text-violet-300"
              >
                support@symplyai.io
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
