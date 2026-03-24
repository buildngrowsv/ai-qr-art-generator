/**
 * =============================================================================
 * QR Art AI — Sitemap Configuration
 * =============================================================================
 *
 * PURPOSE:
 * Generates sitemap.xml for search engine discovery. QR code generators have
 * strong commercial intent — businesses search for branded QR codes for marketing
 * materials, events, and packaging. A sitemap ensures Google indexes both the
 * homepage and the pricing page for maximum SERP coverage.
 *
 * BASE URL: Vercel deployment URL. Update when custom domain is configured.
 *
 * ADDED: 2026-03-24 as part of SEO rollout across all clone apps.
 * =============================================================================
 */

import type { MetadataRoute } from "next";

const BASE_URL = "https://ai-qr-art-generator.vercel.app";

/**
 * This app has both a homepage (tool + landing) and a pricing page, so we
 * include both in the sitemap. The homepage gets priority 1.0 as the main
 * entry point; pricing gets 0.8 as a supporting conversion page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
