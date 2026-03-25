/**
 * middleware.ts — next-intl locale detection and routing middleware
 *
 * PURPOSE:
 * Intercepts incoming requests and routes them to the correct locale
 * based on the Accept-Language header and URL path. This is what powers
 * the "as-needed" locale prefix strategy defined in routing.ts:
 * - /         → served as EN (default, no prefix)
 * - /es/      → served as ES
 * - /pricing  → served as EN
 * - /es/pricing → served as ES
 *
 * MATCHER PATTERN:
 * Excludes API routes, Next.js internal paths (_next, _vercel), and
 * static files (anything with a dot extension like .png, .ico, .js).
 * This prevents locale middleware from running on non-page requests,
 * which would add unnecessary overhead to API calls.
 *
 * ADDED: 2026-03-24 as part of EN+ES i18n rollout.
 */

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except:
  // - /api/* (our API routes)
  // - /_next/* (Next.js build assets)
  // - /_vercel/* (Vercel platform internals)
  // - /.*\..*$ (static files with extensions: .ico, .png, .svg, .js, etc.)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
