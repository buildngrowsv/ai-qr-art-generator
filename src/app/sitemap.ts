/**
 * QR Art AI — sitemap with EN/ES alternates (as-needed locale prefix).
 * Each logical path emits both unprefixed (default EN) and /es/* URLs.
 *
 * UPDATED: 2026-04-15 — added /blog and /blog/[slug] entries.
 */

import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "./blog/blog-posts";

// Canonical domain for sitemap URLs — qrart.symplyai.io.
// Fixed 2026-03-25 (Builder 6): was pointing to vercel.app; sitemap and robots must agree
// on the canonical host so Google doesn't see two separate sites (Vercel vs custom domain).
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://qrart.symplyai.io";

type PathSpec = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly";
};

const PATH_SPECS: PathSpec[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.85, changeFrequency: "monthly" },
  { path: "/dashboard", priority: 0.9, changeFrequency: "weekly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  for (const spec of PATH_SPECS) {
    const enUrl = spec.path === "" ? BASE_URL : `${BASE_URL}${spec.path}`;
    const esUrl = spec.path === "" ? `${BASE_URL}/es` : `${BASE_URL}/es${spec.path}`;
    const languages = {
      en: enUrl,
      es: esUrl,
      "x-default": enUrl,
    };

    entries.push({
      url: enUrl,
      lastModified: new Date(),
      changeFrequency: spec.changeFrequency,
      priority: spec.priority,
      alternates: { languages },
    });

    entries.push({
      url: esUrl,
      lastModified: new Date(),
      changeFrequency: spec.changeFrequency,
      priority: spec.priority * 0.98,
      alternates: { languages },
    });
  }


  entries.push({
    url: `${BASE_URL}/vs/qr-code-monkey`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  });

  entries.push({
    url: `${BASE_URL}/vs/qr-tiger`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  });

  // Blog index page
  entries.push({
    url: `${BASE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  });

  // Individual blog posts
  for (const post of getAllBlogPosts()) {
    entries.push({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    });
  }

  return entries;
}
