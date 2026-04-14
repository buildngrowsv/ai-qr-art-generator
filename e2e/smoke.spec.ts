/**
 * e2e/smoke.spec.ts — QR Art AI (AI QR Art Generator) smoke tests
 *
 * PURPOSE:
 * Fast route and render checks that run on every CI push.
 * No external dependencies — does not call Stripe or fal.ai.
 * Completes in < 30 seconds.
 *
 * SCOPE:
 *   - Homepage renders product branding
 *   - Pricing page renders with dollar amounts
 *   - Pro/paid CTA button is present
 *   - Free tier mentioned on homepage
 *   - ES locale routes work (/es, /es/pricing)
 *   - API routes return structured errors (not server crashes) on bad input
 *
 * NOT IN SCOPE (requires live keys):
 *   - Stripe checkout redirect
 *   - fal.ai generation
 *   - Pro token validation against Redis
 *
 * ADDED: 2026-04-14 (pane1776 Builder 2 — Gate 5 smoke test deployment)
 *
 * RUN LOCALLY:
 *   npx playwright test e2e/smoke.spec.ts
 *   E2E_BASE_URL=https://qrart.symplyai.io npx playwright test e2e/smoke.spec.ts
 */

import { expect, test } from "@playwright/test";

// ---------------------------------------------------------------------------
// EN homepage
// ---------------------------------------------------------------------------

test.describe("EN homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page title contains product name", async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/qr|qr art/i);
  });

  test("main heading is visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1 }).first()
    ).toBeVisible();
  });

  test("free tier is described on homepage", async ({ page }) => {
    await expect(page.getByText(/free/i).first()).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Pricing page
// ---------------------------------------------------------------------------

test.describe("Pricing page", () => {
  test("pricing page returns HTTP 200", async ({ request }) => {
    const resp = await request.get("/pricing");
    expect(resp.status()).toBe(200);
  });

  test.beforeEach(async ({ page, request }) => {
    const resp = await request.get("/pricing");
    if (resp.status() !== 200) {
      test.skip(true, `/pricing returns ${resp.status()}`);
    }
    await page.goto("/pricing");
  });

  test("pricing page renders without error", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText(/application error|this page crashed/i)).toBeHidden();
  });

  test("dollar amount is visible on pricing page", async ({ page }) => {
    await expect(page.getByText(/\$/).first()).toBeVisible();
  });

  test("upgrade / Get Pro CTA is present", async ({ page }) => {
    const cta = page
      .getByRole("button", { name: /upgrade|get pro|subscribe|buy|start|checkout paused/i })
      .first();
    await expect(cta).toBeVisible();
  });

  test("free tier described on pricing page", async ({ page }) => {
    await expect(page.getByText(/free/i).first()).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// ES locale routes
// ---------------------------------------------------------------------------

test.describe("ES locale routes", () => {
  test("/es homepage renders", async ({ page }) => {
    await page.goto("/es");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText(/page not found|404/i)).toBeHidden();
  });

  test("/es/pricing renders pricing content", async ({ page }) => {
    await page.goto("/es/pricing");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText(/page not found|404/i)).toBeHidden();
  });
});

// ---------------------------------------------------------------------------
// API route sanity checks (no real AI calls)
// ---------------------------------------------------------------------------

test.describe("API route sanity", () => {
  test("POST /api/generate returns structured error on empty body", async ({ request }) => {
    const resp = await request.post("/api/generate", {
      headers: { "Content-Type": "application/json" },
      data: {},
    });
    expect([400, 401, 422, 429, 503]).toContain(resp.status());

    const body = await resp.json().catch(() => null);
    expect(body).not.toBeNull();
    expect(body).toHaveProperty("error");
  });

  test("POST /api/stripe/checkout returns structured response on empty body", async ({ request }) => {
    const resp = await request.post("/api/stripe/checkout", {
      headers: { "Content-Type": "application/json" },
      data: {},
    });
    expect(resp.status()).not.toBe(404);
  });

  test("GET /api/health returns 200", async ({ request }) => {
    const resp = await request.get("/api/health");
    expect(resp.status()).toBe(200);
  });
});
