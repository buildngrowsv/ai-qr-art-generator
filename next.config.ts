/**
 * next.config.ts — Next.js 16 configuration for QR Art AI
 *
 * This configuration file controls build behavior, image optimization,
 * and other Next.js-specific settings.
 *
 * KEY DECISIONS:
 *   - We allow fal.ai CDN images in next/image (when we upgrade from <img>)
 *   - Dev server runs on port 4827 (configured via package.json scripts)
 *   - No custom webpack config needed for v1
 *
 * i18n INTEGRATION (added 2026-03-24):
 *   - Wrapped with createNextIntlPlugin pointing to src/i18n/request.ts
 *   - The plugin injects the next-intl resolve alias for 'next-intl/config'
 *
 * NEXT.JS 16 / TURBOPACK COMPAT FIX (added 2026-03-24):
 *   - next-intl ^3.26.5 plugin writes the turbopack alias to
 *     `experimental.turbo.resolveAlias` (the Next.js 13-15 key).
 *   - Next.js 16 moved this to top-level `turbopack.resolveAlias`.
 *     The old key is invalid and silently ignored, which causes a
 *     runtime "Couldn't find next-intl config file" error during SSG.
 *   - We detect this mismatch and copy the alias to the correct location.
 *   - This workaround can be removed once next-intl ships a fix for Next.js 16.
 *     Track: https://github.com/amannn/next-intl/issues (turbopack alias issue)
 */

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Initialize the next-intl plugin.
 * The argument is the path to the request config file (relative to project root).
 * This file is what next-intl uses server-side to resolve locale + messages.
 */
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /**
   * Tell Next.js webpack bundler NOT to bundle the `stripe` package.
   * Instead, require it at runtime from node_modules in the serverless function.
   *
   * WHY: The Stripe Node.js SDK uses some Node.js built-ins (net, tls, https) that
   * webpack cannot bundle correctly in Next.js App Router serverless functions. When
   * webpack tries to bundle Stripe, the resulting bundle either throws at runtime or
   * produces incorrect behavior. Setting `serverExternalPackages: ['stripe']` tells
   * Next.js to treat `stripe` as an external dependency — loaded from node_modules at
   * runtime rather than inlined into the function bundle. This is the Stripe-recommended
   * pattern for Next.js App Router.
   *
   * SYMPTOM WITHOUT THIS: /api/stripe/checkout returns 500 "Failed to create checkout
   * session" even when STRIPE_SECRET_KEY is correctly set and valid.
   * Fixed 2026-03-25 after isolating that direct Stripe curl worked but the Next.js
   * API route failed — confirming the bundling issue, not a key or configuration issue.
   */
  serverExternalPackages: ["stripe"],

  /**
   * Allow images from fal.ai CDN domains.
   * This is needed if/when we switch from <img> to next/image for the
   * generated QR art preview. next/image requires explicit domain allowlisting
   * for security (prevents loading images from arbitrary domains).
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.fal.media",
      },
      {
        protocol: "https",
        hostname: "fal.media",
      },
    ],
  },
};

/**
 * Apply the next-intl plugin and then fix the turbopack alias location
 * for Next.js 16 compatibility.
 *
 * next-intl ^3.26.5 still writes to `experimental.turbo.resolveAlias`
 * (the pre-16 key). Next.js 16 renamed this to top-level `turbopack`.
 * We migrate the alias after the plugin runs so Turbopack can find
 * the next-intl config module at runtime.
 *
 * eslint-disable-next-line @typescript-eslint/no-explicit-any — the config
 * object shape is not fully typed for the transitional turbo→turbopack key.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pluginConfig = withNextIntl(nextConfig) as any;

// Migrate next-intl alias from experimental.turbo (Next.js ≤15) to
// top-level turbopack (Next.js 16+) if the plugin set the old key.
if (pluginConfig?.experimental?.turbo?.resolveAlias?.["next-intl/config"]) {
  const intlAlias =
    pluginConfig.experimental.turbo.resolveAlias["next-intl/config"];
  // Merge into the correct top-level turbopack key
  pluginConfig.turbopack = {
    ...(pluginConfig.turbopack ?? {}),
    resolveAlias: {
      ...(pluginConfig.turbopack?.resolveAlias ?? {}),
      "next-intl/config": intlAlias,
    },
  };
  // Clean up the now-incorrect experimental.turbo key to suppress the
  // "Unrecognized key(s) in object: 'turbo' at 'experimental'" warning.
  delete pluginConfig.experimental.turbo;
  if (Object.keys(pluginConfig.experimental).length === 0) {
    delete pluginConfig.experimental;
  }
}

export default pluginConfig;
