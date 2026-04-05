import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page title contains product name", async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/qr.*art|qr.*code.*art/i);
  });

  test("main heading is visible", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });

  test("no application error on load", async ({ page }) => {
    await expect(page.getByText(/application error|this page crashed/i)).toBeHidden();
  });
});

test.describe("API route sanity", () => {
  test("POST /api/generate returns structured error on empty body", async ({ request }) => {
    const resp = await request.post("/api/generate", {
      headers: { "Content-Type": "application/json" },
      data: {},
    });
    expect([400, 401, 422, 429]).toContain(resp.status());
  });
});
