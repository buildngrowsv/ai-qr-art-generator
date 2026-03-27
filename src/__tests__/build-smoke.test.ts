/**
 * build-smoke.test.ts — Smoke tests for AI QR Art Generator
 *
 * ROUTE CONTRACT:
 * - POST /api/generate: server-side fail-closed rate limit runs first (429)
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

  it("should return 429 from /api/generate when Upstash rate limiting is not configured", async () => {
    // The route intentionally checks server-side rate limiting before request-body
    // validation so anonymous abuse is blocked with minimal server work.
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const { POST } = await import("../app/api/generate/route");
    const req = new Request("http://localhost/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // missing url and style
    });

    const res = await POST(req as any);
    expect(res.status).toBe(429);
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
