/**
 * vitest.config.ts — Test configuration for AI QR Art Generator
 *
 * WHY VITEST: ESM/App Router compatibility. See ai-product-photo-generator/vitest.config.ts.
 * NOTE: @vitejs/plugin-react omitted (API-route-only tests, no JSX needed).
 *
 * HOW TO RUN:
 *   npm test           — run once
 *   npm test -- --watch — watch mode
 */
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
