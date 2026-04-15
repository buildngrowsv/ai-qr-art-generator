/**
 * /vs/[slug] — Dynamic Competitor Comparison Page for QRArtify
 *
 * PURPOSE:
 * Dedicated comparison pages targeting "[competitor] alternative" search queries.
 * These are some of the highest-intent keywords in SaaS — people searching
 * "QR Code Monkey alternative" are actively looking to switch tools.
 *
 * SEO VALUE:
 * - Title tags include both brand names for maximum keyword coverage
 * - Structured feature comparison tables are parseable by search engines
 * - Canonical URLs prevent duplicate content across locale variants
 * - Rich meta descriptions drive CTR from search results
 *
 * ARCHITECTURE:
 * Uses generateStaticParams to pre-render all comparison pages at build time.
 * Each competitor's data (features, pricing, pros/cons) is defined inline
 * rather than fetched from a CMS — these pages change infrequently and
 * static generation gives the best Core Web Vitals scores.
 *
 * CREATED: 2026-04-06 for organic traffic growth via comparison SEO
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
const SITE_URL = "https://qrcode.symplyai.io";

/**
 * Feature comparison row shape.
 * "us" and "them" use string values so we can show nuance
 * (e.g., "AI-generated" vs "Manual templates") rather than just checkmarks.
 */
interface FeatureRow {
  feature: string;
  us: string;
  them: string;
}

interface CompetitorData {
  name: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  heroSubtitle: string;
  introText: string;
  features: FeatureRow[];
  ourAdvantages: string[];
  theirAdvantages: string[];
  verdict: string;
}

/**
 * Competitor comparison data — all the facts for feature tables and copy.
 *
 * WHY INLINE DATA:
 * These pages are updated rarely (when competitors change pricing or features).
 * Keeping data in-code means: (1) no CMS dependency, (2) type safety,
 * (3) build-time rendering for best performance, (4) easy for any builder
 * to update without learning a separate data layer.
 */
const competitors: Record<string, CompetitorData> = {
  "qr-code-monkey": {
    name: "QR Code Monkey",
    slug: "qr-code-monkey",
    metaTitle:
      "QRArtify vs QR Code Monkey (2026) — AI Art QR Codes vs Basic Customization",
    metaDescription:
      "Compare QRArtify and QR Code Monkey side by side. See why creators choose AI-generated artistic QR codes over basic color and logo customization.",
    heroSubtitle: "AI-powered art generation vs basic color customization",
    introText:
      "QR Code Monkey is a well-known free QR code generator that lets you customize colors, add logos, and pick from basic shapes. QRArtify takes a fundamentally different approach: instead of tweaking standard QR codes, our AI generates entirely new artistic interpretations of your QR data. The result is QR codes that look like genuine artwork while remaining fully scannable.",
    features: [
      {
        feature: "AI Art Generation",
        us: "Full AI-powered artistic styles (cyberpunk, watercolor, nature, etc.)",
        them: "No AI generation — manual color/logo customization only",
      },
      {
        feature: "Style Presets",
        us: "8+ AI art styles with unique visual output each time",
        them: "Basic shape templates (dots, rounded, etc.)",
      },
      {
        feature: "Output Uniqueness",
        us: "Every QR code is a unique AI-generated artwork",
        them: "Output follows predictable template patterns",
      },
      {
        feature: "Free Tier",
        us: "3 AI art generations per day, no signup",
        them: "Unlimited basic QR codes, free",
      },
      {
        feature: "Logo Embedding",
        us: "AI integrates branding into the art style",
        them: "Manual logo overlay on standard QR",
      },
      {
        feature: "Scan Reliability",
        us: "AI-optimized error correction ensures scannability",
        them: "Standard error correction (reliable)",
      },
      {
        feature: "Bulk Generation",
        us: "Coming soon (Pro plan)",
        them: "Available (paid plans)",
      },
      {
        feature: "Dynamic QR Codes",
        us: "Static QR codes (URL baked in)",
        them: "Static only (free), dynamic on paid plans",
      },
      {
        feature: "Price (Pro)",
        us: "$9.90/mo — unlimited AI art generations",
        them: "Free basic; paid plans from $6.99/mo for analytics",
      },
    ],
    ourAdvantages: [
      "True AI art generation creates unique, visually stunning QR codes",
      "Multiple artistic styles (cyberpunk, watercolor, nature, minimalist, neon)",
      "Each generation is unique — no two QR codes look the same",
      "AI automatically handles error correction for reliable scanning",
      "Modern dark-mode UI designed for creative professionals",
    ],
    theirAdvantages: [
      "Completely free tier with unlimited basic QR code generation",
      "Well-established brand with years of market presence",
      "Simple interface — no learning curve for basic customization",
      "Bulk generation available on paid plans",
      "EPS/SVG export for print-ready files",
    ],
    verdict:
      "Choose QRArtify if you want QR codes that double as art pieces — for business cards, packaging, menus, and marketing materials where visual impact matters. Choose QR Code Monkey if you need basic, functional QR codes with simple color customization at no cost.",
  },
  "qr-tiger": {
    name: "QR Tiger",
    slug: "qr-tiger",
    metaTitle:
      "QRArtify vs QR Tiger (2026) — AI Art QR Codes vs Enterprise QR Management",
    metaDescription:
      "Compare QRArtify and QR Tiger side by side. AI-generated artistic QR codes vs enterprise QR management with analytics and dynamic codes.",
    heroSubtitle:
      "Creative AI art generation vs enterprise QR tracking and analytics",
    introText:
      "QR Tiger is a full-featured enterprise QR code platform focused on dynamic QR codes, scan analytics, and team management. QRArtify serves a different need: transforming QR codes into AI-generated artwork. If you need scan tracking dashboards, QR Tiger is built for that. If you want QR codes that look like cyberpunk art, watercolor paintings, or nature scenes, QRArtify is your tool.",
    features: [
      {
        feature: "AI Art Generation",
        us: "Full AI-powered artistic style generation",
        them: "Template-based customization (colors, frames, patterns)",
      },
      {
        feature: "Dynamic QR Codes",
        us: "Static QR codes with artistic styling",
        them: "Full dynamic QR support — edit URL after printing",
      },
      {
        feature: "Scan Analytics",
        us: "Not available (art-focused tool)",
        them: "Comprehensive scan tracking, location, device data",
      },
      {
        feature: "Art Styles",
        us: "8+ AI styles: cyberpunk, watercolor, nature, neon, minimalist",
        them: "Frames and templates — no AI art generation",
      },
      {
        feature: "Team Management",
        us: "Individual creator tool",
        them: "Multi-user team features, SSO, role management",
      },
      {
        feature: "API Access",
        us: "Coming soon",
        them: "Full REST API for enterprise integration",
      },
      {
        feature: "Output Quality",
        us: "High-res AI-generated artwork",
        them: "Standard vector QR with customization",
      },
      {
        feature: "Free Tier",
        us: "3 AI art generations per day, no signup",
        them: "3 dynamic QR codes free, limited features",
      },
      {
        feature: "Price (Pro)",
        us: "$9.90/mo — unlimited AI art",
        them: "From $7/mo (Regular) to $37/mo (Advanced)",
      },
    ],
    ourAdvantages: [
      "AI generates truly artistic QR codes — not just colored templates",
      "Unique output every time — no two QR codes look alike",
      "Simpler pricing — one Pro plan covers everything",
      "Built for creators and designers who want visual impact",
      "No account required for free tier",
    ],
    theirAdvantages: [
      "Dynamic QR codes — edit destination URL after printing",
      "Comprehensive scan analytics and tracking",
      "Enterprise features: team management, SSO, API access",
      "Established platform with extensive integration ecosystem",
      "Bulk QR code generation for large campaigns",
    ],
    verdict:
      "Choose QRArtify if your QR codes need to be visually stunning — for creative marketing, premium packaging, art installations, and branded materials. Choose QR Tiger if you need enterprise QR management with dynamic codes, scan analytics, and team features.",
  },
  "beaconstac": {
    name: "Beaconstac",
    slug: "beaconstac",
    metaTitle:
      "QRArtify vs Beaconstac (2026) — AI Art QR Codes vs Enterprise QR Platform",
    metaDescription:
      "Compare QRArtify and Beaconstac side by side. AI-generated artistic QR codes vs enterprise-grade dynamic QR management with analytics and integrations.",
    heroSubtitle:
      "AI-powered art generation vs enterprise QR management and analytics",
    introText:
      "Beaconstac is an enterprise QR code management platform offering dynamic QR codes, scan analytics, bulk generation, and CRM integrations. QRArtify takes a completely different approach: instead of managing QR codes at scale, we use AI to transform them into stunning visual artwork. If you need enterprise QR fleet management, Beaconstac is built for that. If you want QR codes that double as art pieces for premium branding, QRArtify delivers.",
    features: [
      {
        feature: "AI Art Generation",
        us: "Full AI-powered artistic styles (cyberpunk, watercolor, nature, etc.)",
        them: "No AI generation — template-based customization",
      },
      {
        feature: "Dynamic QR Codes",
        us: "Static QR codes with artistic styling",
        them: "Full dynamic QR support with retargeting",
      },
      {
        feature: "Scan Analytics",
        us: "Not available (art-focused tool)",
        them: "GPS-level scan tracking, device analytics, retargeting pixels",
      },
      {
        feature: "CRM Integration",
        us: "Standalone creative tool",
        them: "Salesforce, HubSpot, Zapier, and more",
      },
      {
        feature: "Art Styles",
        us: "8+ unique AI art styles with new output each time",
        them: "Color, logo, and frame customization only",
      },
      {
        feature: "Bulk Generation",
        us: "Coming soon (Pro plan)",
        them: "Full bulk creation and management",
      },
      {
        feature: "Free Tier",
        us: "3 AI art generations per day, no signup",
        them: "14-day free trial only",
      },
      {
        feature: "Price (Pro)",
        us: "$9.90/mo — unlimited AI art generations",
        them: "From $5/mo (Lite) to $99/mo (Business)",
      },
    ],
    ourAdvantages: [
      "AI generates truly artistic QR codes — not templates with color swaps",
      "Every generation produces a unique artwork",
      "Free tier available without credit card or signup",
      "Built for creators who want visual impact, not dashboards",
      "Affordable pricing for individual users",
    ],
    theirAdvantages: [
      "Enterprise-grade dynamic QR code management",
      "Comprehensive scan analytics with GPS tracking",
      "CRM integrations (Salesforce, HubSpot, Zapier)",
      "Bulk QR generation for large-scale campaigns",
      "White-label solutions for agencies",
    ],
    verdict:
      "Choose QRArtify if you want QR codes that are visually stunning artwork — for business cards, premium packaging, and creative marketing. Choose Beaconstac if you need enterprise QR code fleet management with analytics, CRM integration, and bulk generation.",
  },
  "scanova": {
    name: "Scanova",
    slug: "scanova",
    metaTitle:
      "QRArtify vs Scanova (2026) — AI Art QR Codes vs Standard QR Generator",
    metaDescription:
      "Compare QRArtify and Scanova feature by feature. See how AI-generated artistic QR codes compare to traditional QR code generation with design templates.",
    heroSubtitle:
      "AI-generated artwork vs traditional QR code design templates",
    introText:
      "Scanova is a QR code generator offering dynamic QR codes, design customization with templates, and scan analytics. QRArtify approaches QR codes differently: our AI generates entirely new artistic interpretations of your QR data, producing unique visual artwork rather than templated designs. If you want a traditional QR generator with tracking, Scanova works. If you want QR codes that look like professional artwork, QRArtify is the choice.",
    features: [
      {
        feature: "AI Art Generation",
        us: "Full AI-powered artistic styles with unique output each time",
        them: "No AI — template-based design customization",
      },
      {
        feature: "Design Options",
        us: "8+ AI art styles (cyberpunk, watercolor, neon, minimalist, nature)",
        them: "Color schemes, logo overlay, pre-built templates",
      },
      {
        feature: "Dynamic QR Codes",
        us: "Static QR codes with artistic styling",
        them: "Dynamic QR codes — edit destination after creation",
      },
      {
        feature: "Scan Analytics",
        us: "Not available (art-focused tool)",
        them: "Scan tracking with time, location, and device data",
      },
      {
        feature: "Output Uniqueness",
        us: "Every QR code is a unique AI-generated artwork",
        them: "Same template produces similar-looking codes",
      },
      {
        feature: "Free Tier",
        us: "3 AI art generations per day, no signup",
        them: "Free trial with limited features",
      },
      {
        feature: "Price (Pro)",
        us: "$9.90/mo — unlimited AI art generations",
        them: "From $5/mo (Lite) to $49/mo (Business)",
      },
    ],
    ourAdvantages: [
      "True AI art generation — every QR code is a unique artwork",
      "Multiple artistic styles beyond simple color/logo customization",
      "No signup required for free tier",
      "Modern, creator-focused interface",
      "Affordable flat-rate pricing",
    ],
    theirAdvantages: [
      "Dynamic QR codes with editable destinations",
      "Scan analytics and tracking",
      "Pre-built design templates for quick customization",
      "Established platform with broader QR type support (vCard, WiFi, etc.)",
      "White-labeling options for businesses",
    ],
    verdict:
      "Choose QRArtify if you want your QR codes to be genuine works of art — for creative branding, premium print materials, and marketing that stands out. Choose Scanova if you need a traditional QR generator with dynamic codes, scan analytics, and team features.",
  },
  "unitag": {
    name: "Unitag",
    slug: "unitag",
    metaTitle:
      "QRArtify vs Unitag (2026) — AI Art QR Codes vs Visual QR Customization",
    metaDescription:
      "Compare QRArtify and Unitag side by side. AI-generated artistic QR codes vs Unitag's visual QR customization with shapes, colors, and logo embedding.",
    heroSubtitle:
      "AI-generated art vs manual visual QR customization",
    introText:
      "Unitag is a QR code platform known for its visual customization features — custom shapes, gradient colors, logo embedding, and eye-catching designs. QRArtify goes beyond customization: our AI generates entirely new artistic compositions from your QR data. While Unitag lets you decorate a QR code, QRArtify transforms it into genuine artwork. Both improve on plain black-and-white codes, but the approach and output are fundamentally different.",
    features: [
      {
        feature: "AI Art Generation",
        us: "Full AI-powered artistic generation with unique output every time",
        them: "No AI — manual visual customization tools",
      },
      {
        feature: "Visual Customization",
        us: "AI handles all design — choose a style and generate",
        them: "Deep manual control: shapes, gradients, corners, eyes, colors",
      },
      {
        feature: "Output Uniqueness",
        us: "Every generation is a one-of-a-kind artwork",
        them: "Same settings produce visually identical codes",
      },
      {
        feature: "Design Effort",
        us: "Select style + click generate — AI does the work",
        them: "Manual design process — more control but more effort",
      },
      {
        feature: "Art Styles",
        us: "8+ AI styles: cyberpunk, watercolor, nature, neon, minimalist",
        them: "Shape and color palettes — visually enhanced but not artistic",
      },
      {
        feature: "Dynamic QR Codes",
        us: "Static QR codes with artistic styling",
        them: "Dynamic QR codes with tracking",
      },
      {
        feature: "Free Tier",
        us: "3 AI art generations per day, no signup",
        them: "Free tier with watermark and limited features",
      },
      {
        feature: "Price (Pro)",
        us: "$9.90/mo — unlimited AI art generations",
        them: "From $2.99/mo (Starter) to $12.99/mo (Premium)",
      },
    ],
    ourAdvantages: [
      "AI generates genuine artwork — not just decorated QR codes",
      "Zero design effort: pick a style and generate",
      "Each output is unique — ideal for limited-edition or premium use",
      "No signup needed for free tier",
      "Artistic styles that make QR codes conversation starters",
    ],
    theirAdvantages: [
      "Granular manual control over every visual element",
      "Dynamic QR codes with destination editing",
      "Very affordable entry-level pricing",
      "Supports many QR code types (vCard, WiFi, PDF, etc.)",
      "Well-known platform with established user base",
    ],
    verdict:
      "Choose QRArtify if you want QR codes that are true works of art — generated by AI in seconds with no design skills needed. Choose Unitag if you prefer hands-on visual customization with fine-grained control over shapes, colors, and gradients.",
  },
  "qrcode-ai": {
    name: "QRCode AI",
    slug: "qrcode-ai",
    metaTitle:
      "QRArtify vs QRCode AI (2026) — Which AI QR Code Art Generator Is Better?",
    metaDescription:
      "Compare QRArtify and QRCode AI side by side. Two AI-powered QR code art generators — see which delivers better styles, pricing, and output quality.",
    heroSubtitle:
      "Two AI QR art generators — which delivers better creative results?",
    introText:
      "QRCode AI is another AI-powered QR code art generator that uses generative AI to create artistic QR codes. Both QRArtify and QRCode AI share the same core concept, but they differ in art style variety, output quality, pricing, and user experience. If you're choosing between AI QR tools, this comparison breaks down the key differences so you can pick the one that fits your creative workflow.",
    features: [
      {
        feature: "AI Model Quality",
        us: "Latest generation AI with fine-tuned QR art models",
        them: "AI-powered generation with variable output quality",
      },
      {
        feature: "Art Styles",
        us: "8+ curated styles: cyberpunk, watercolor, nature, neon, minimalist, and more",
        them: "Multiple styles — selection varies by plan",
      },
      {
        feature: "Scan Reliability",
        us: "AI-optimized error correction — tested before delivery",
        them: "AI generation with standard error correction",
      },
      {
        feature: "Output Resolution",
        us: "High-resolution PNG downloads included",
        them: "Resolution may vary by plan tier",
      },
      {
        feature: "Free Tier",
        us: "3 AI art generations per day, no signup required",
        them: "Limited free generations with watermark",
      },
      {
        feature: "Generation Speed",
        us: "Under 30 seconds per generation",
        them: "Varies — can be slower for complex styles",
      },
      {
        feature: "Price (Pro)",
        us: "$9.90/mo — unlimited AI art generations",
        them: "Varies by plan — typically $10-20/mo",
      },
    ],
    ourAdvantages: [
      "Wider variety of curated artistic styles",
      "No signup required — start generating immediately",
      "Consistently high scan reliability across all art styles",
      "Fast generation (under 30 seconds)",
      "Simple, transparent pricing with generous free tier",
    ],
    theirAdvantages: [
      "Early mover in the AI QR art space",
      "May offer additional customization parameters",
      "Active development with new features",
      "Community of AI art enthusiasts",
      "Multiple output format options",
    ],
    verdict:
      "Both tools use AI to generate artistic QR codes. Choose QRArtify for a wider selection of curated art styles, no-signup free tier, and reliable scan quality. Choose QRCode AI if you prefer their specific aesthetic or customization options.",
  },
  "stable-diffusion-qr": {
    name: "Stable Diffusion QR",
    slug: "stable-diffusion-qr",
    metaTitle:
      "QRArtify vs Stable Diffusion QR (2026) — Instant AI QR Art vs DIY ControlNet Setup",
    metaDescription:
      "Compare QRArtify and Stable Diffusion QR (ControlNet). See why creators choose one-click AI QR art over manual open-source setup with ComfyUI or Automatic1111.",
    heroSubtitle:
      "One-click AI QR art vs manual open-source ControlNet workflows",
    introText:
      "Stable Diffusion QR uses the open-source Stable Diffusion model with ControlNet to generate artistic QR codes. It's powerful and free, but requires significant technical setup: installing Python, downloading models (several GB), configuring ControlNet parameters, and troubleshooting scan reliability. QRArtify wraps similar AI capabilities in a simple web interface — upload your QR data, pick a style, and get art in under 30 seconds. No GPU, no Python, no configuration required.",
    features: [
      {
        feature: "Setup Required",
        us: "None — web app, works in any browser",
        them: "Significant — Python, CUDA, model downloads (5-10 GB), ControlNet config",
      },
      {
        feature: "GPU Needed",
        us: "No — cloud-processed",
        them: "Yes — NVIDIA GPU with 8+ GB VRAM recommended",
      },
      {
        feature: "Art Quality",
        us: "Curated AI styles optimized for QR scanability",
        them: "Unlimited flexibility but scan reliability requires manual tuning",
      },
      {
        feature: "Scan Reliability",
        us: "AI-optimized error correction — pre-validated output",
        them: "Depends on ControlNet strength parameter — often fails to scan",
      },
      {
        feature: "Time to First QR",
        us: "Under 30 seconds from visiting the site",
        them: "Hours to days (setup, model download, parameter tuning)",
      },
      {
        feature: "Style Variety",
        us: "8+ curated styles with consistent quality",
        them: "Unlimited with custom prompts — but quality varies wildly",
      },
      {
        feature: "Cost",
        us: "Free tier (3/day) or $9.90/mo Pro",
        them: "Free (software) but requires expensive GPU hardware or cloud GPU rental",
      },
    ],
    ourAdvantages: [
      "Zero setup — generate QR art in seconds from any browser",
      "No GPU required — works on any device including phones",
      "Pre-optimized for scan reliability — every output is tested",
      "Curated art styles that consistently produce beautiful results",
      "Regular updates and new styles without reinstalling anything",
    ],
    theirAdvantages: [
      "Completely free and open-source software",
      "Unlimited customization via custom prompts and parameters",
      "Full control over the generation pipeline",
      "Can integrate into existing Stable Diffusion workflows",
      "No usage limits (only limited by your hardware)",
    ],
    verdict:
      "Choose QRArtify if you want beautiful AI QR art instantly — no setup, no GPU, no configuration. Choose Stable Diffusion QR if you're a technical user who wants full control over the generation pipeline and already has a Stable Diffusion setup with a capable GPU.",
  },
  "hovercode": {
    name: "Hovercode",
    slug: "hovercode",
    metaTitle:
      "QRArtify vs Hovercode (2026) — AI Art QR Codes vs Dynamic QR with Design Options",
    metaDescription:
      "Compare QRArtify and Hovercode side by side. AI-generated artistic QR codes vs dynamic QR codes with design customization and analytics.",
    heroSubtitle:
      "AI-powered artwork vs dynamic QR codes with design customization",
    introText:
      "Hovercode is a dynamic QR code platform that offers design customization options including colors, logos, shapes, and frames, along with scan analytics and editable destinations. QRArtify takes a fundamentally different approach: instead of customizing standard QR patterns, our AI generates entirely new artistic compositions. Hovercode makes QR codes prettier; QRArtify makes them into art.",
    features: [
      {
        feature: "AI Art Generation",
        us: "Full AI-powered artistic styles with unique output each time",
        them: "No AI — manual design customization (colors, logos, shapes)",
      },
      {
        feature: "Dynamic QR Codes",
        us: "Static QR codes with artistic styling",
        them: "Full dynamic QR support — edit destination anytime",
      },
      {
        feature: "Scan Analytics",
        us: "Not available (art-focused tool)",
        them: "Scan tracking with device, location, and time data",
      },
      {
        feature: "Design Approach",
        us: "AI generates unique artwork automatically — pick style and go",
        them: "Manual customization: colors, logos, frames, shapes",
      },
      {
        feature: "Output Uniqueness",
        us: "Every generation is a one-of-a-kind artwork",
        them: "Same settings produce identical QR codes",
      },
      {
        feature: "Free Tier",
        us: "3 AI art generations per day, no signup",
        them: "Free plan with limited dynamic QR codes",
      },
      {
        feature: "Price (Pro)",
        us: "$9.90/mo — unlimited AI art generations",
        them: "From $5/mo (Starter) to $49/mo (Pro)",
      },
    ],
    ourAdvantages: [
      "AI transforms QR codes into genuine visual art",
      "Unique output every time — ideal for premium branding",
      "No design skills needed — AI handles the creative work",
      "No signup required for free tier",
      "Affordable flat-rate pricing for unlimited art",
    ],
    theirAdvantages: [
      "Dynamic QR codes — change destination without reprinting",
      "Scan analytics for campaign tracking",
      "Manual design control for brand-consistent customization",
      "Multiple QR code types (URL, vCard, WiFi, etc.)",
      "Team collaboration features",
    ],
    verdict:
      "Choose QRArtify if you want QR codes that are genuine works of art — visually stunning pieces for premium packaging, creative marketing, and standout business cards. Choose Hovercode if you need dynamic QR codes with scan analytics and straightforward design customization.",
  },
};

/**
 * Pre-render all comparison pages at build time for optimal performance.
 * Static generation means these pages load instantly and score well on
 * Core Web Vitals — critical for SEO ranking.
 */
/**
 * Reject unknown slugs — Next.js returns 404 immediately without
 * invoking the page function. Prevents Vercel serverless hangs.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(competitors).map((slug) => ({ slug }));
}

/**
 * Dynamic metadata per competitor — ensures each comparison page has
 * unique, keyword-rich title and description for search engines.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = competitors[slug];
  if (!data) return {};
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: `${SITE_URL}/vs/${data.slug}` },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `${SITE_URL}/vs/${data.slug}`,
      type: "article",
      siteName: "QRArtify",
    },
    robots: { index: true, follow: true },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = competitors[slug];
  if (!data) notFound();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5]">
      {/* Navigation */}
      <nav className="border-b border-[#1e1e2e] px-6 py-4">
        {/* BreadcrumbList JSON-LD — breadcrumb rich snippets in Google SERPs */}
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: "" },
            { name: "Alternatives", url: `${""}/vs` },
          ]}
        />
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-600 bg-clip-text text-xl font-bold text-transparent"
          >
            QRArtify
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/vs"
              className="text-sm text-zinc-400 hover:text-white"
            >
              All Comparisons
            </Link>
            <Link
              href="/"
              className="rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white transition hover:from-purple-600 hover:to-fuchsia-700"
            >
              Try QRArtify Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Hero Section */}
        <div className="mb-12">
          <Link
            href="/vs"
            className="mb-4 inline-block text-sm text-purple-400 hover:underline"
          >
            &larr; All Comparisons
          </Link>
          <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">
            QRArtify vs{" "}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-600 bg-clip-text text-transparent">
              {data.name}
            </span>
          </h1>
          <p className="text-lg text-zinc-400">{data.heroSubtitle}</p>
        </div>

        {/* Introduction */}
        <div className="mb-12 rounded-2xl border border-[#1e1e2e] bg-[#13131a] p-8">
          <p className="text-zinc-300 leading-relaxed">{data.introText}</p>
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Feature Comparison</h2>
          <div className="overflow-x-auto rounded-2xl border border-[#1e1e2e]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1e1e2e] bg-[#13131a]">
                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-purple-400">
                    QRArtify
                  </th>
                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">
                    {data.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.features.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={
                      i % 2 === 0 ? "bg-[#0a0a0f]" : "bg-[#13131a]/50"
                    }
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">
                      {row.us}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {row.them}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pros Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-8">
            <h3 className="mb-4 text-lg font-semibold text-purple-400">
              Why Choose QRArtify
            </h3>
            <ul className="space-y-3">
              {data.ourAdvantages.map((adv) => (
                <li key={adv} className="flex gap-3 text-sm text-zinc-300">
                  <span className="mt-0.5 text-purple-400">&#10003;</span>
                  {adv}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#1e1e2e] bg-[#13131a] p-8">
            <h3 className="mb-4 text-lg font-semibold text-zinc-400">
              Why Choose {data.name}
            </h3>
            <ul className="space-y-3">
              {data.theirAdvantages.map((adv) => (
                <li key={adv} className="flex gap-3 text-sm text-zinc-400">
                  <span className="mt-0.5">&#8226;</span>
                  {adv}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Verdict */}
        <div className="mb-12 rounded-2xl border border-[#1e1e2e] bg-[#13131a] p-8">
          <h2 className="mb-4 text-xl font-bold">The Verdict</h2>
          <p className="text-zinc-300 leading-relaxed">{data.verdict}</p>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-10 text-center">
          <h2 className="mb-3 text-2xl font-bold">
            Try QRArtify Free — No Signup Required
          </h2>
          <p className="mb-6 text-zinc-400">
            Generate up to 3 AI art QR codes per day. See the difference
            AI-powered art makes over basic QR customization.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-600 px-8 py-3 font-semibold text-white transition hover:from-purple-600 hover:to-fuchsia-700"
          >
            Generate QR Art Now
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2e] px-6 py-8 text-center text-sm text-zinc-500">
        <p>
          &copy; {new Date().getFullYear()} QRArtify.{" "}
          <a
            href="https://symplyai.io"
            target="_blank"
            rel="noopener"
            className="text-purple-400 hover:underline"
          >
            Powered by SymplyAI
          </a>
        </p>
      </footer>
    </div>
  );
}
