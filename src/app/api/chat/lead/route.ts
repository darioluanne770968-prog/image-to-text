import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Save lead to Supabase
    const { data, error } = await supabase.from("chat_leads").insert({
      name,
      email,
      created_at: new Date().toISOString(),
    }).select();

    if (error) {
      console.error("Failed to save lead:", error);
      return NextResponse.json(
        { error: "Failed to save lead", details: error.message },
        { status: 500 }
      );
    }

    console.log("Lead saved successfully:", data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
