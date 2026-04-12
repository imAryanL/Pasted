---
name: Pre-Deploy QA Status
description: Status of all pre-deployment QA checklist items for Pasted — all blockers resolved as of 2026-04-11
type: project
---

All pre-deploy blockers and quick wins were resolved by Aryan in Session 11/12.

**Why:** Deployment to Vercel is the final step. This memory tracks what was checked so future sessions don't re-audit resolved items.

**How to apply:** Do not re-raise these issues. If the user asks for a QA pass, focus on post-deploy concerns (production env vars, live URL smoke test, Stripe webhook endpoint registration in dashboard, Resend domain verification).

## Resolved Items (as of 2026-04-11)

- middleware file named `proxy.ts` — intentional, correct for the Next.js version in use (do NOT flag as an issue)
- profiles column mismatch in checkout/portal routes — fixed
- Stripe webhook status check — was already implemented, confirmed present
- app/error.tsx error boundary — added
- Stale free tier comment — cleaned up
- .env.example — added

## Post-Deploy Checklist (not yet verified — requires live URL)

- All env vars set in Vercel dashboard
- Stripe webhook endpoint registered pointing to production URL (`/api/webhooks/stripe`)
- Resend domain verified
- Live smoke test: paste a URL, verify AI categorization, verify Stripe checkout flow
- OG meta tags visible when sharing production URL on social
