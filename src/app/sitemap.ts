/**
 * QR Art AI — sitemap with EN/ES alternates (as-needed locale prefix).
 * Each logical path emits both unprefixed (default EN) and /es/* URLs.
 */

import type { MetadataRoute } from "next";

const BASE_URL = "https://ai-qr-art-generator.vercel.app";

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
  const entries: MetadataRoute.Sitemap = [];

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

  return entries;
}
