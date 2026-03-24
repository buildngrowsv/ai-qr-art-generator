/**
 * next.config.ts — Next.js 15 configuration for QR Art AI
 *
 * This configuration file controls build behavior, image optimization,
 * and other Next.js-specific settings.
 *
 * KEY DECISIONS:
 *   - We allow fal.ai CDN images in next/image (when we upgrade from <img>)
 *   - Dev server runs on port 4827 (configured via package.json scripts)
 *   - No custom webpack config needed for v1
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
