# Pasted

**Paste it. Forget it. Find it.**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

An AI-powered bookmark manager that organizes your saved URLs automatically. Paste any link and Gemini AI categorizes it, generates summaries, extracts tags, and surfaces actionable steps — so you never lose track of what matters.

**Live:** [pasted-ai.vercel.app](https://pasted-ai.vercel.app)

## Features

- **Paste any URL** — automatically fetches metadata (title, description, images) via Open Graph
- **AI Categorization** — Gemini AI analyzes each save and assigns categories, tags, and summaries
- **Image Vision** — Gemini analyzes OG thumbnails for richer context
- **Actionables** — AI extracts actionable steps from saved content (recipes, tutorials, guides, etc.)
- **Smart Search & Filters** — search by title/URL and filter by AI-generated categories
- **Stripe Billing** — free tier (10 saves/month) and Pro tier (unlimited) with full checkout and customer portal
- **Google OAuth** — secure authentication via Supabase Auth
- **Row Level Security** — all data is protected per-user at the database level
- **Responsive UI** — dark theme, animated cards, modal detail views, toast notifications

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **AI:** Google Gemini API
- **Payments:** Stripe (Checkout, Webhooks, Customer Portal)
- **Metadata:** Cheerio (Open Graph scraping)
- **Animations:** Framer Motion
- **Validation:** Zod
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Google Gemini API key
- A Stripe account

### Setup

```bash
git clone https://github.com/imAryanL/Pasted.git
cd Pasted/pasted
npm install
```

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
NEXT_PUBLIC_SITE_URL=
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Screenshots

<!-- Add screenshots here -->
