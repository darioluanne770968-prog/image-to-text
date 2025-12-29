import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { PLANS, type PlanType } from "@/lib/stripe/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body as { plan: PlanType };

    if (!PLANS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: PLANS[plan].priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
