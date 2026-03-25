// app/api/stripe/checkout/route.ts
// Creates a Stripe Checkout Session for upgrading to Pro.
// The frontend calls this, gets back a URL, and redirects the user to Stripe's hosted payment page.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    // Section 1: Authenticate the user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    // Section 2: Get or create Stripe customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let stripeCustomerId = profile?.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      stripeCustomerId = customer.id;

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", user.id);
    }

    // Section 3: Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
    });

    // Section 4: Return the URL
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
