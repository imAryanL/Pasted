---
name: Pasted Project Status
description: Current build phase, all completed features, and remaining work before launch
type: project
---

Pasted is an AI-powered bookmark manager SaaS. "Paste it. Forget it. Find it."

**Current phase:** All pre-deploy work complete. Ready to deploy to Vercel. No blockers.

**Why:** Aryan is building this to replace AryFlix on his resume — needs auth + payments + AI + database to tell a strong SWE story in interviews.

**How to apply:** Do not suggest adding new features. Do not suggest any more pre-deploy work. The only remaining task is Vercel deployment and post-deploy Stripe webhook configuration.

---

## Completed Features (as of 2026-04-11, Session 11)

- Paste any URL + OG metadata fetch
- AI auto-categorization, summaries, tags (Gemini Flash)
- Category filter pills + search bar (URL search params)
- Google OAuth via Supabase
- Supabase PostgreSQL + RLS policies
- Delete saves (server action + AlertDialog confirmation on SaveCard)
- Stripe setup + checkout endpoint + webhook handler + admin client
- Tier enforcement (free 30/month cap, Pro unlimited)
- Stats cards (total saves, saves this month, top category)
- Sidebar nav with usage bar, upgrade button, user profile/sign out
- Dark mode + metadata
- Account/billing page (profile, plan badge, usage bar, Stripe Customer Portal link, sign out)
- Stripe portal API route
- Account buttons (UpgradeButton, ManageBillingButton, SignOutButton with loading states)
- Sidebar shows actual subscription tier (not hardcoded)
- Toast notifications via sonner on save/delete
- Framer Motion card animations (staggered entrance, hover lift, tap feedback)
- Personalized greeting component (time-based messages + random subtitles)
- Font: Inter, Color theme: purple accent
- Custom purple "P" bookmark favicon and sidebar icon
- SaveCard layout cleanup (image overlays, source badges, decluttered)
- Clean X/Twitter titles (strip @handle suffix)
- Gemini image vision (OG thumbnail analysis for better summaries)
- short_summary field (1-sentence card preview vs full summary for popup)
- Gemini thinking disabled (thinkingBudget: 0) for faster responses (~4-5s)
- Card popup modal (Dialog with hero image, AI summary, tags, source label, delete, open original)
- Actionables feature (schema, Gemini extraction, toggle action, card component, page, sidebar link)
- Actionables page (collapsible rows, stats box, action_type tags, Framer Motion expand animation)
- action_type field end-to-end (Gemini prompt, save action, Supabase column)
- Image placeholders (ImageOff icon) for saves with no image
- Sidebar nav route-aware highlighting
- AI summary expanded (4-6 sentences for modal)
- Modal enlarged (max-w-4xl), beige accent border on AI summary card
- Card colors unified to bg-zinc-800
- Optimistic checkbox updates for actionables (useOptimistic)
- Middleware kept as proxy.ts (intentional for latest Next.js version — not a bug)
- Profiles column mismatch fix (Stripe checkout/portal)
- Stripe webhook status check fix
- app/error.tsx added
- Stale comment fixes
- .env.example added
- Landing page live
- Security hardened
- Privacy policy added

---

## Remaining Tasks

1. Deploy to Vercel (~1 hour)
2. Post-deploy: configure Stripe webhook endpoint with live Vercel URL (~15 min)
3. Post-deploy: smoke test core flows (save URL, delete, Stripe checkout, actionables)

---

## Cut Features (post-launch maybe)

Collections, Weekly Digest, AI connections, similar saves, remind me, link health monitoring, highlight extraction
