/**
 * routing.ts — next-intl locale routing configuration
 *
 * PURPOSE:
 * Defines the supported locales (en, es) and routing strategy for the
 * internationalized QR Art AI app. This is the single source of truth
 * for which locales exist and how URLs are structured.
 *
 * LOCALE PREFIX STRATEGY: "as-needed"
 * - English (default): /dashboard, /pricing (no /en/ prefix)
 * - Spanish: /es/dashboard, /es/pricing
 * This keeps English URLs clean for existing users and SEO while
 * Spanish gets explicit locale prefix for hreflang correctness.
 *
 * ADDED: 2026-03-24 as part of EN+ES i18n rollout across clone factory apps.
 */

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
