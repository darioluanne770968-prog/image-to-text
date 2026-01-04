import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

// Use service role key for webhook (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId && plan) {
          // Update user's plan in database
          const { error } = await supabaseAdmin
            .from("profiles")
            .update({
              plan: plan,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);

          if (error) {
            console.error("Failed to update user plan:", error);
          } else {
            console.log(`User ${userId} subscribed to ${plan}`);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const status = subscription.status;

        // Find user by subscription ID and update status
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: status === "active" ? "active" : "inactive",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("Failed to update subscription:", error);
        }
        console.log(`Subscription updated: ${subscription.id} - ${status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // Reset user to free plan
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
            subscription_status: "canceled",
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          console.error("Failed to cancel subscription:", error);
        }
        console.log(`Subscription cancelled: ${subscription.id}`);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Payment succeeded: ${invoice.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Update subscription status
        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Failed to update payment status:", error);
        }
        console.log(`Payment failed: ${invoice.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
