/**
 * layout.tsx — Root layout for the AI QR Art Generator
 *
 * This is the top-level layout that wraps every page in the app. It provides:
 *   1. Global font loading (Geist Sans + Geist Mono from Google Fonts)
 *   2. Global CSS import (Tailwind + custom styles)
 *   3. Site header navigation (sticky, shown on all pages)
 *   4. Site footer (shown on all pages)
 *   5. SEO metadata (title, description, Open Graph)
 *
 * DESIGN DECISION: We use a dark theme throughout because AI/creative tools
 * look more premium with dark backgrounds, and QR art images pop better
 * against dark surfaces. Light mode is not planned for v1.
 *
 * FONT CHOICE: Geist is the font family designed by Vercel — clean, modern,
 * and highly readable. It's the standard choice for Next.js apps and gives
 * us a professional SaaS appearance with zero design overhead.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeaderNavigation from "@/components/SiteHeaderNavigation";
import SiteFooterSection from "@/components/SiteFooterSection";

/**
 * Load Geist Sans — the primary body font.
 * CSS variable --font-geist-sans is referenced in globals.css.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Load Geist Mono — used for code-like elements (URLs, technical text).
 * CSS variable --font-geist-mono is referenced in globals.css.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * SEO Metadata — critical for organic traffic and social sharing.
 *
 * The title and description are crafted for:
 *   1. Search engines (target keywords: "QR code art", "AI QR code generator")
 *   2. Social sharing (compelling description that drives clicks)
 *   3. Browser tabs (short, recognizable title)
 *
 * WHY "QR Art AI": Short, memorable, and describes exactly what the product does.
 * Open Graph and Twitter Card metadata ensure our landing page looks great
 * when shared on social media, which is a key organic growth channel.
 */
export const metadata: Metadata = {
  title: "QR Art AI — Transform URLs into Stunning QR Code Art",
  description:
    "Generate beautiful, artistic QR codes powered by AI. Turn any URL into scannable art. Free to try, instant results. Perfect for marketing, events, and branding.",
  keywords: [
    "QR code art",
    "AI QR code generator",
    "artistic QR codes",
    "QR code design",
    "beautiful QR codes",
  ],
  openGraph: {
    title: "QR Art AI — Transform URLs into Stunning QR Code Art",
    description:
      "Generate beautiful, artistic QR codes powered by AI. Free to try.",
    type: "website",
    locale: "en_US",
    url: "https://ai-qr-art-generator.vercel.app",
    siteName: "QR Art AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Art AI — Transform URLs into Stunning QR Code Art",
    description:
      "Generate beautiful, artistic QR codes powered by AI. Free to try.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * JSON-LD structured data for Google rich snippets.
 * Added 2026-03-24 by Scout 15 for SEO across all clone apps.
 * QR code generators have strong commercial intent — businesses search
 * for branded QR codes for marketing materials, events, and packaging.
 */
const jsonLdSoftwareApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AI QR Art Generator",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Transform any URL into beautiful artistic QR codes. Choose from dozens of styles — watercolor, geometric, circuit board, floral, and more. All QR codes are guaranteed to scan.",
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
  "featureList": ["Artistic QR code generation", "Multiple visual styles", "Guaranteed scannable output", "High-resolution download"]
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "Do artistic QR codes still scan?", "acceptedAnswer": {"@type": "Answer", "text": "Yes! Our AI generates beautiful QR code art while preserving error-correction data. All codes are tested to scan correctly."}},
    {"@type": "Question", "name": "Is the QR art generator free?", "acceptedAnswer": {"@type": "Answer", "text": "Yes! Generate up to 3 artistic QR codes for free daily. Upgrade for unlimited generations."}},
    {"@type": "Question", "name": "What styles are available?", "acceptedAnswer": {"@type": "Answer", "text": "Dozens of styles including watercolor, geometric, circuit board, floral, neon, minimalist, and more."}}
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      {/*
       * Body uses min-h-full + flex col to ensure the footer sticks to the
       * bottom of the viewport even on short pages. The pt-16 accounts for
       * the fixed header height (h-16 = 4rem = 64px).
       */}
      <body className="min-h-full flex flex-col pt-16">
        <SiteHeaderNavigation />
        <main className="flex-1">{children}</main>
        <SiteFooterSection />
      </body>
    </html>
  );
}
