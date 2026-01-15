import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET || "";

// Use service role key for webhook (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// Price ID to plan mapping
const PRICE_TO_PLAN: Record<string, string> = {
  "pri_01ke8pdzc3dskrz3mfcfxqdbp7": "basic",
  "pri_01ke8pd5j0z1v1477tw8xvcxtz": "pro",
  "pri_01ke8pb3w3b99240j0k7b1999y": "enterprise",
};

function verifySignature(payload: string, signature: string, timestamp: string): boolean {
  if (!webhookSecret) return true; // Skip verification if no secret configured
  
  const signedPayload = `${timestamp}:${payload}`;
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload)
    .digest("hex");
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("paddle-signature") || "";
  
  // Parse signature header
  const parts = signature.split(";").reduce((acc, part) => {
    const [key, value] = part.split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const timestamp = parts["ts"] || "";
  const h1 = parts["h1"] || "";

  // Verify webhook signature
  if (webhookSecret && !verifySignature(body, h1, timestamp)) {
    console.error("Invalid webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(body);
    const eventType = event.event_type;

    console.log(`Paddle webhook: ${eventType}`);

    switch (eventType) {
      case "subscription.created":
      case "subscription.activated": {
        const subscriptionId = event.data.id;
        const customerId = event.data.customer_id;
        const priceId = event.data.items?.[0]?.price?.id;
        const plan = PRICE_TO_PLAN[priceId] || "basic";
        const customData = event.data.custom_data;
        const userId = customData?.user_id;

        if (userId) {
          const { error } = await supabaseAdmin
            .from("profiles")
            .update({
              plan: plan,
              paddle_customer_id: customerId,
              paddle_subscription_id: subscriptionId,
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

      case "subscription.updated": {
        const subscriptionId = event.data.id;
        const status = event.data.status;
        const priceId = event.data.items?.[0]?.price?.id;
        const plan = PRICE_TO_PLAN[priceId];

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
          .eq("paddle_subscription_id", subscriptionId);

        if (error) {
          console.error("Failed to update subscription:", error);
        }
        console.log(`Subscription updated: ${subscriptionId} - ${status}`);
        break;
      }

      case "subscription.canceled":
      case "subscription.paused": {
        const subscriptionId = event.data.id;

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
            subscription_status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("paddle_subscription_id", subscriptionId);

        if (error) {
          console.error("Failed to cancel subscription:", error);
        }
        console.log(`Subscription cancelled/paused: ${subscriptionId}`);
        break;
      }

      case "subscription.resumed": {
        const subscriptionId = event.data.id;
        const priceId = event.data.items?.[0]?.price?.id;
        const plan = PRICE_TO_PLAN[priceId] || "basic";

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: plan,
            subscription_status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("paddle_subscription_id", subscriptionId);

        if (error) {
          console.error("Failed to resume subscription:", error);
        }
        console.log(`Subscription resumed: ${subscriptionId}`);
        break;
      }

      case "transaction.completed": {
        console.log(`Transaction completed: ${event.data.id}`);
        break;
      }

      case "transaction.payment_failed": {
        const subscriptionId = event.data.subscription_id;

        if (subscriptionId) {
          const { error } = await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("paddle_subscription_id", subscriptionId);

          if (error) {
            console.error("Failed to update payment status:", error);
          }
        }
        console.log(`Payment failed for transaction: ${event.data.id}`);
        break;
      }

      default:
        console.log(`Unhandled event: ${eventType}`);
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
