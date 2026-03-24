/**
 * build-smoke.test.ts — Smoke tests for AI QR Art Generator
 *
 * ROUTE CONTRACT:
 * - POST /api/generate: input validation first (400), then rate limit (429)
 * - POST /api/stripe/checkout: 503 if STRIPE_SECRET_KEY absent; 400 if bad price ID
 * - POST /api/stripe/webhook: 500 if STRIPE_WEBHOOK_SECRET absent; 400 if bad body
 * - POST /api/stripe/portal: tests that the route exists and exports POST
 *
 * HOW TO RUN: npm test
 */

describe("Build smoke tests — ai-qr-art-generator", () => {
  it("should import next.config without throwing", async () => {
    const config = await import("../../next.config");
    expect(config).toBeDefined();
    expect(typeof config.default).toBe("object");
  });

  it("should export POST from /api/generate route", async () => {
    const route = await import("../app/api/generate/route");
    expect(typeof route.POST).toBe("function");
  });

  it("should export POST from /api/stripe/checkout route", async () => {
    const route = await import("../app/api/stripe/checkout/route");
    expect(typeof route.POST).toBe("function");
  });

  it("should export POST from /api/stripe/webhook route", async () => {
    const route = await import("../app/api/stripe/webhook/route");
    expect(typeof route.POST).toBe("function");
  });

  it("should export POST from /api/stripe/portal route", async () => {
    const route = await import("../app/api/stripe/portal/route");
    expect(typeof route.POST).toBe("function");
  });

  it("should return 400 from /api/generate when URL is missing", async () => {
    // In this route, input validation runs before FAL_KEY check.
    // Missing 'url' field → 400 Bad Request.
    const { POST } = await import("../app/api/generate/route");
    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // missing url and style
    });

    const res = await POST(req as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty("error");
  });

  it("should return 503 from /api/stripe/checkout when STRIPE_SECRET_KEY is absent", async () => {
    // Checkout route returns 503 when STRIPE_SECRET_KEY is missing —
    // explicitly indicates "payments not configured" to callers.
    delete process.env.STRIPE_SECRET_KEY;

    const { POST } = await import("../app/api/stripe/checkout/route");
    const req = new Request("http://localhost/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: "price_test123", tier: "pro" }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(503);
  });
});
