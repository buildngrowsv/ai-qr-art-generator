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

const BASE_URL = "https://ai-qr-art-generator.vercel.app";

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
