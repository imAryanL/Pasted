---
name: Pasted Project Status
description: Current build phase, all completed features, and remaining work before launch
type: project
---

Pasted is an AI-powered bookmark manager SaaS. "Paste it. Forget it. Find it."

**Current phase:** Phase 4 complete / pre-deployment. All core features are built.

**Why:** Aryan is building this to replace AryFlix on his resume — needs auth + payments + AI + database to tell a strong SWE story in interviews.

**How to apply:** Do not suggest adding new features. Redirect any scope creep to the post-launch list. Push toward deployment.

---

## Completed Features (as of 2026-03-27, Session 7)

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
- Stripe portal API route (app/api/stripe/portal/route.ts)
- Account buttons component (UpgradeButton, ManageBillingButton, SignOutButton with loading states)
- Sidebar now shows actual subscription tier (not hardcoded)
- Toast notifications via sonner on save/delete
- Framer Motion card animations (staggered entrance, hover lift, tap feedback)
- Personalized greeting component (time-based messages + random subtitles)
- Font: Inter (swapped from Geist)
- Color theme: purple accent (swapped from amber/gold) across ALL components
- Custom purple "P" bookmark favicon and sidebar icon
- Category filter pills moved from sidebar to dashboard
- Deleted sidebar-category-links.tsx

---

## Remaining Before Launch

1. SaveCard layout cleanup — move category badge to overlay on image, remove URL/source badge clutter (discussed, not started — ~1 hour)
2. Deploy to Vercel (~1 hour)
3. Post-deploy: configure Stripe webhook endpoint with live Vercel URL (~15 min)

---

## Cut Features (post-launch maybe)

Collections, Weekly Digest, AI connections, similar saves, remind me, link health monitoring, highlight extraction
