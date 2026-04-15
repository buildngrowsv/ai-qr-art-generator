/**
 * /get-started — Onboarding landing page for QRArtAI.
 *
 * Created 2026-04-15 — W5-05 pSEO expansion.
 */

import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://qrart.symplyai.io";
const PRODUCT_NAME = "QRArtAI";

export const metadata: Metadata = {
  title: `Get Started — ${PRODUCT_NAME}`,
  description:
    "Create artistic QR codes in 3 easy steps. Enter your URL, choose an art style, and download a scannable QR code that doubles as artwork — free, no design skills needed.",
  alternates: { canonical: `${SITE_URL}/get-started` },
  openGraph: {
    title: `Get Started with ${PRODUCT_NAME}`,
    description: "Generate beautiful, scannable QR code art with AI.",
    url: `${SITE_URL}/get-started`,
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: PRODUCT_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Get Started with ${PRODUCT_NAME}`,
    description: "AI QR art generator — scannable QR codes that look like art.",
    images: ["/opengraph-image"],
  },
};

const STEPS = [
  {
    number: "1",
    title: "Enter Your URL",
    description: "Paste any URL, Wi-Fi credentials, or text you want encoded. The AI preserves scannability while transforming the QR pattern into art.",
  },
  {
    number: "2",
    title: "Choose an Art Style",
    description: "Select from cyberpunk, watercolor, abstract, nature, geometric, anime, or custom prompts. Each style creates a unique artistic QR code.",
  },
  {
    number: "3",
    title: "Download Your QR Art",
    description: "Get a high-resolution QR code that scans perfectly and looks stunning. Ready for business cards, posters, packaging, or social media.",
  },
];

const FEATURES = [
  { title: "Always Scannable", description: "AI ensures every artistic QR code remains fully scannable by all major QR readers — beauty without sacrificing function." },
  { title: "Free to Try", description: "Create up to 3 QR art codes per day for free. Pro plans unlock unlimited generations and custom style prompts." },
  { title: "Dozens of Art Styles", description: "Cyberpunk, watercolor, abstract, nature, geometric, anime, stained glass — or describe your own custom style." },
  { title: "Print-Ready Quality", description: "High-resolution output suitable for business cards, flyers, packaging, posters, and digital displays." },
];

export default function GetStartedPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Get Started", item: `${SITE_URL}/get-started` },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            {PRODUCT_NAME}
          </Link>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
          Create QR Code Art in{" "}
          <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            3 Simple Steps
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          No design skills needed. Enter a URL, pick an art style, and get a
          scannable QR code that looks like a masterpiece.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative rounded-2xl border border-gray-800 bg-gray-900/50 p-8 text-center">
              <span className="absolute top-4 left-4 text-xs font-bold text-purple-400">STEP {step.number}</span>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/10 text-2xl">
                {["\ud83d\udd17", "\ud83c\udfa8", "\u2b07\ufe0f"][i]}
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{step.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Why Choose {PRODUCT_NAME}?</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-violet-950/20 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">Ready? Create Your First QR Art Now.</h2>
          <p className="mt-2 text-gray-400">Free to try — no account needed.</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-violet-500 px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity">
              Create QR Art &rarr;
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-gray-700 px-8 py-3.5 text-base font-semibold text-gray-300 hover:border-gray-500 hover:text-white transition-all">
              View Pro Plans
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} {PRODUCT_NAME}. All rights reserved.</p>
      </footer>
    </main>
  );
}
