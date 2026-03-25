/**
 * request.ts — next-intl server-side request configuration
 *
 * PURPOSE:
 * Provides the per-request locale and message bundle to next-intl.
 * This file is referenced by next-intl plugin in next.config.ts and
 * runs on every server-side request to determine which locale to use
 * and which JSON message file to load.
 *
 * LOCALE RESOLUTION:
 * 1. Read requestLocale from the URL segment (set by middleware)
 * 2. Validate it's a known locale (en or es)
 * 3. Fall back to defaultLocale ("en") if unknown or missing
 *
 * MESSAGE LOADING:
 * Dynamic import of src/messages/{locale}.json — Next.js code-splits
 * these so English users never download Spanish strings and vice versa.
 *
 * ADDED: 2026-03-24 as part of EN+ES i18n rollout.
 */

import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the locale from the request (it's a promise in next-intl v3)
  let locale = await requestLocale;

  // Validate locale — fall back to default if missing or not in our list
  if (!locale || !routing.locales.includes(locale as "en" | "es")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Dynamic import ensures each locale's messages are bundled separately,
    // minimizing JS payload per user (EN users don't load ES strings)
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
