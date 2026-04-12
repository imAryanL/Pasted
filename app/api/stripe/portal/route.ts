// app/api/stripe/portal/route.ts
// Creates a Stripe Customer Portal session so Pro users can manage their billing.
// The frontend calls this, gets back a URL, and redirects the user to Stripe's hosted portal page.
// Stripe Doc Reference: stripe.billingPortal.sessions.create()

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    // Section 1: Authenticate the user (same as checkout)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // Section 2: Look up the Stripe customer ID from the profile
    // Unlike checkout, we do NOT create a customer here.
    // If they don't have one, they've never subscribed — nothing to manage.
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    const stripeCustomerId = profile?.stripe_customer_id;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account found. Please upgrade first." },
        { status: 400 }
      );
    }

    // Section 3: Create the Portal Session
    // This gives us a short-lived URL to Stripe's hosted billing management page.
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
    });

    // Section 4: Return the URL
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("Stripe portal error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
