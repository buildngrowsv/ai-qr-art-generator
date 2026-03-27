# QRArtify — AI QR Code Art Generator — Status

**Last updated:** 2026-03-26 (Builder 6 — canonical URL fix verified, task abfb1ad2 closed)
**Repo:** github.com/buildngrowsv/ai-qr-art-generator
**Stack:** Next.js 15, TypeScript, Tailwind CSS v4, fal.ai FLUX, Stripe, next-intl (EN+ES)

## Production URLs

| Host | Status |
|------|--------|
| **https://qrart.symplyai.io** | ✅ HTTP 200 — CANONICAL |
| https://ai-qr-art-generator.vercel.app | ✅ HTTP 200 — Vercel backup |

## Component Status

| Component | Status | Notes |
|-----------|--------|-------|
| Landing page | ✅ LIVE | Marketing-polished, unique SEO copy |
| Core tool (generate) | ✅ LIVE | fal.ai FLUX model, art-style presets |
| API route (/api/generate) | ✅ LIVE | Server-side, IP rate-limited, FAL_KEY set |
| Stripe checkout route | ✅ LIVE | POST /api/stripe/checkout → JSON response (not 404) |
| Stripe webhook route | ✅ LIVE | Signature verification in place |
| Pricing page | ✅ LIVE | /pricing and /es/pricing — 200 OK |
| EN+ES i18n | ✅ LIVE | next-intl, middleware.ts, app/[locale]/ routing |
| SEO — canonical URLs | ✅ FIXED | All siteUrl/BASE_URL updated to qrart.symplyai.io |
| Build | ✅ PASSES | Next.js 15, 16 static pages |
| Deploy | ✅ LIVE | qrart.symplyai.io |
| FAL_KEY | ✅ SET | Vercel production env var set |

## Environment Variables (Vercel Production)

| Var | Status | Notes |
|-----|--------|-------|
| `FAL_KEY` | ✅ Set | fal.ai key |
| `STRIPE_SECRET_KEY` | ✅ Set | sk_live_ key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ Set | pk_live_ key |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO` | ✅ Set | price_1TEUivGsPhST… ($9/mo) |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS` | ✅ Set | price for $29/mo |
| `STRIPE_WEBHOOK_SECRET` | ✅ Set | whsec_ for signature verification |
| `NEXT_PUBLIC_APP_URL` | ✅ Set | https://qrart.symplyai.io |

## What Works Right Now

- Landing page renders fully ✅ (HTTP 200 verified)
- Pricing page renders with real price IDs ✅ (Pro $9/mo, Business $29/mo)
- POST /api/stripe/checkout → returns JSON (Stripe connection live, route working) ✅
- POST /api/stripe/webhook → signature verification in place ✅
- POST /api/generate → IP rate limit fires, FAL_KEY confirmed set ✅
- EN+ES i18n routing working ✅
- Canonical URLs fixed: robots.txt, sitemap.xml, OG tags, hreflang all use qrart.symplyai.io ✅

## Remaining Items (BCL / Dashboard)

- [ ] Verify Stripe webhook endpoint in Stripe dashboard points to https://qrart.symplyai.io/api/stripe/webhook
- [ ] E2E payment flow test: actual checkout.stripe.com → success → credits added

## Previous Verification History

- 2026-03-24 Builder 3: checkout returned 404 on old stale Vercel deploy — FIXED by multiple
  subsequent deploys with working routes (commits 24e725d, 8b2602f, 7c25b7c, 146cf7c, cdfd29b,
  45d0ed4, 24e725d, 9ad3190, 8b39a2a)
- 2026-03-25 Builder 6: canonical URL fix — all siteUrl/BASE_URL updated to qrart.symplyai.io
  from hardcoded ai-qr-art-generator.vercel.app (commit e5b5b94)
