# QRArtify (ai-qr-art-generator) — engineering status

## Production (Vercel)

- **Example deploy URL:** `https://ai-qr-code-mf7tczmba-buildngrowsvs-projects.vercel.app` (name varies by project).
- **Payments:** App Router routes live in repo under `src/app/api/stripe/checkout`, `webhook`, `portal`.

## Verification (2026-03-24, Builder 3)

- **Homepage:** HTTP 200; Next.js shell + chunks load.
- **`POST /api/stripe/checkout` on the deploy above returned `404` (matched Next `404` page, not JSON).** That means the **currently linked Vercel deployment does not expose the Stripe API routes** (stale build, wrong project, or preview without serverless functions). **Fix:** redeploy this repo to that Vercel project from `main` after `npm run build` succeeds locally; confirm `POST /api/stripe/checkout` returns `400/401` JSON (not HTML 404) with an empty body.

## Local check

```bash
npm ci
npm run build
```

## Stripe env (Vercel)

Set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, price IDs as documented in `src/app/api/stripe/checkout/route.ts`, and `STRIPE_WEBHOOK_SECRET` for `src/app/api/stripe/webhook/route.ts`.
