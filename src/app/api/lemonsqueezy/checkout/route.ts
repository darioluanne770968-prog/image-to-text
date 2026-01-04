import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LEMONSQUEEZY_PLANS, type LemonSqueezyPlanType } from "@/lib/lemonsqueezy/config";

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
    const { plan } = body as { plan: LemonSqueezyPlanType };

    if (!LEMONSQUEEZY_PLANS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const variantId = LEMONSQUEEZY_PLANS[plan].variantId;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;

    // Create checkout URL with custom data
    const checkoutUrl = new URL("https://imagetotext.lemonsqueezy.com/checkout/buy/" + variantId);

    // Add custom data to pass user ID to webhook
    checkoutUrl.searchParams.set("checkout[custom][user_id]", user.id);
    checkoutUrl.searchParams.set("checkout[email]", user.email || "");
    checkoutUrl.searchParams.set("checkout[success_url]", `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`);

    return NextResponse.json({ url: checkoutUrl.toString() });
  } catch (error) {
    console.error("LemonSqueezy checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
