import { expect, test } from "@playwright/test";

const configuredBaseUrl =
  process.env.PLAYWRIGHT_BASE_URL ?? "__BASE_URL__";
const expectedAuthPath = process.env.E2E_EXPECTED_AUTH_PATH ?? "/login";

test.describe("__APP_NAME__ smoke chassis", () => {
  test("landing page renders a usable shell", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();

    const bodyText = await page.locator("body").innerText();
    expect(bodyText.trim().length).toBeGreaterThan(40);
    await expect(page).toHaveURL(new RegExp(`^${escapeForRegExp(configuredBaseUrl)}`));
  });

  test("dashboard route does not hard-fail", async ({ page }) => {
    const dashboardResponse = await page.goto("/dashboard");

    expect(dashboardResponse, "dashboard navigation should return a response").not.toBeNull();
    expect(dashboardResponse!.status(), "dashboard should not 500").toBeLessThan(500);

    await page.waitForLoadState("networkidle");

    const resolvedPathname = new URL(page.url()).pathname;
    const validDestinations = ["/dashboard", expectedAuthPath];

    expect(
      validDestinations.includes(resolvedPathname),
      `expected ${validDestinations.join(" or ")}, received ${resolvedPathname}`,
    ).toBeTruthy();
  });

  test("clone owner can extend checkout coverage here", async ({ page }) => {
    await page.goto("/");

    // Replace this placeholder assertion when the clone exposes a
    // pricing or checkout trigger. Keeping a live test block here makes
    // the extension point obvious during adoption.
    await expect(page.locator("body")).toContainText(/./);
  });
});

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
