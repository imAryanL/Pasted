// lib/stripe/index.ts
// Initializes the Stripe SDK with our secret key.
// Import this wherever you need to talk to Stripe's API (server-side only).

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});
