import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";

// Use service role key for webhook (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// Variant ID to plan mapping
const VARIANT_TO_PLAN: Record<string, string> = {
  "1191936": "basic",
  "1191941": "pro",
  "1191943": "enterprise",
};

function verifySignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac("sha256", webhookSecret);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("x-signature") || "";

  // Verify webhook signature
  if (webhookSecret && !verifySignature(body, signature)) {
    console.error("Invalid webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(body);
    const eventName = event.meta?.event_name;
    const customData = event.meta?.custom_data;
    const subscriptionData = event.data?.attributes;

    console.log(`LemonSqueezy webhook: ${eventName}`);

    switch (eventName) {
      case "subscription_created": {
        const userId = customData?.user_id;
        const variantId = String(subscriptionData?.variant_id);
        const plan = VARIANT_TO_PLAN[variantId] || "basic";
        const subscriptionId = String(event.data?.id);
        const customerId = String(subscriptionData?.customer_id);

        if (userId) {
          const { error } = await supabaseAdmin
            .from("profiles")
            .update({
              plan: plan,
              lemonsqueezy_customer_id: customerId,
              lemonsqueezy_subscription_id: subscriptionId,
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

      case "subscription_updated": {
        const subscriptionId = String(event.data?.id);
        const status = subscriptionData?.status;
        const variantId = String(subscriptionData?.variant_id);
        const plan = VARIANT_TO_PLAN[variantId];

        const updateData: Record<string, string> = {
          subscription_status: status === "active" ? "active" : "inactive",
          updated_at: new Date().toISOString(),
        };

        if (plan) {
          updateData.plan = plan;
        }

        const { error } = await supabaseAdmin
          .from("profiles")
          .update(updateData)
          .eq("lemonsqueezy_subscription_id", subscriptionId);

        if (error) {
          console.error("Failed to update subscription:", error);
        }
        console.log(`Subscription updated: ${subscriptionId} - ${status}`);
        break;
      }

      case "subscription_cancelled":
      case "subscription_expired": {
        const subscriptionId = String(event.data?.id);

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
            subscription_status: "canceled",
            lemonsqueezy_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("lemonsqueezy_subscription_id", subscriptionId);

        if (error) {
          console.error("Failed to cancel subscription:", error);
        }
        console.log(`Subscription cancelled/expired: ${subscriptionId}`);
        break;
      }

      case "subscription_resumed": {
        const subscriptionId = String(event.data?.id);
        const variantId = String(subscriptionData?.variant_id);
        const plan = VARIANT_TO_PLAN[variantId] || "basic";

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: plan,
            subscription_status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("lemonsqueezy_subscription_id", subscriptionId);

        if (error) {
          console.error("Failed to resume subscription:", error);
        }
        console.log(`Subscription resumed: ${subscriptionId}`);
        break;
      }

      case "subscription_payment_success": {
        const subscriptionId = String(event.data?.attributes?.subscription_id);
        console.log(`Payment succeeded for subscription: ${subscriptionId}`);
        break;
      }

      case "subscription_payment_failed": {
        const subscriptionId = String(event.data?.attributes?.subscription_id);

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("lemonsqueezy_subscription_id", subscriptionId);

        if (error) {
          console.error("Failed to update payment status:", error);
        }
        console.log(`Payment failed for subscription: ${subscriptionId}`);
        break;
      }

      default:
        console.log(`Unhandled event: ${eventName}`);
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
