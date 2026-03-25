/**
 * [locale]/page.tsx — Locale-aware landing page entry point
 *
 * PURPOSE:
 * Re-exports the shared LandingPage component from src/app/page.tsx so
 * that both EN (/) and ES (/es) routes render the same landing page content.
 *
 * WHY RE-EXPORT RATHER THAN MOVE:
 * The landing page content in src/app/page.tsx does not yet use any
 * translation keys — it's static English content for now. Re-exporting
 * allows us to wire up the locale routing without disrupting the existing
 * page structure. When we add translated copy to the landing page sections,
 * we'll update the source page.tsx to use useTranslations() and the
 * Spanish content will automatically appear at /es.
 *
 * FUTURE: When translating landing page copy, import useTranslations
 * in src/app/page.tsx (or move the component here) and add keys to
 * src/messages/en.json and src/messages/es.json.
 *
 * ADDED: 2026-03-24 as part of EN+ES i18n rollout.
 */

export { default } from "../page";
