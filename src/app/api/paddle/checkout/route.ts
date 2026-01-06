import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PADDLE_PLANS, type PaddlePlanType } from "@/lib/paddle/config";

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
    const { plan } = body as { plan: PaddlePlanType };

    if (!PADDLE_PLANS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = PADDLE_PLANS[plan].priceId;

    // Return price ID and user info for Paddle.js checkout
    return NextResponse.json({
      priceId,
      customData: {
        user_id: user.id,
      },
      customerEmail: user.email,
    });
  } catch (error) {
    console.error("Paddle checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
