// app/api/stripe/webhook/route.ts
// Handles incoming webhook events from Stripe.
// Verifies the signature, then updates the user's subscription tier in the database.

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(request: Request) {
  // Section 1: Read the raw body and signature
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  // Section 2: Verify the signature
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Section 3: Handle subscription events
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;

      // Only grant Pro if the subscription is active or trialing
      const tier = subscription.status === "active" || subscription.status === "trialing"
        ? "pro"
        : "free";

      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({ subscription_tier: tier })
        .eq("stripe_customer_id", subscription.customer as string);

      if (updateError) {
        console.error("Failed to update subscription tier:", updateError);
        return NextResponse.json({ error: "DB update failed" }, { status: 500 });
      }

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      const { error: deleteError } = await supabaseAdmin
        .from("profiles")
        .update({ subscription_tier: "free" })
        .eq("stripe_customer_id", subscription.customer as string);

      if (deleteError) {
        console.error("Failed to downgrade subscription:", deleteError);
        return NextResponse.json({ error: "DB update failed" }, { status: 500 });
      }

      break;
    }
  }

  // Section 4: Return 200 to acknowledge receipt
  return NextResponse.json({ received: true });
}
