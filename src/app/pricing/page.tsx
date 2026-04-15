/**
 * Standalone /pricing route — re-exports from [locale]/pricing.
 *
 * WHY: With next-intl localePrefix "as-needed", bare /pricing matches the
 * [locale] dynamic segment (locale="pricing") instead of [locale]/pricing.
 * Vercel's x-matched-path shows /[locale], so the pricing page's generateMetadata
 * never runs — the homepage metadata appears instead.
 *
 * This standalone route gives Next.js a direct /pricing match that bypasses
 * the [locale] catch-all. Metadata (title, canonical, OG) resolves correctly.
 *
 * Pattern: same as ai-product-photo-generator/src/app/pricing/page.tsx.
 */
export { default, generateMetadata } from "../[locale]/pricing/page";

