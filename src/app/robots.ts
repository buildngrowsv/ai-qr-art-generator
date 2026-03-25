/**
 * =============================================================================
 * QR Art AI — Robots.txt Configuration
 * =============================================================================
 *
 * PURPOSE:
 * Generates robots.txt for search engine crawlers. Allows full public crawling
 * while blocking API routes and Next.js internals.
 *
 * ADDED: 2026-03-24 as part of SEO rollout across all clone apps.
 * =============================================================================
 */

import type { MetadataRoute } from "next";

// Canonical domain — qrart.symplyai.io is the symplyai.io subdomain for this product.
// Fixed 2026-03-25 (Builder 6): was hardcoded to vercel.app causing search engines to
// index the wrong host and generating duplicate content warnings in GSC.
const BASE_URL = "https://qrart.symplyai.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
