import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Save lead to Supabase
    const { error } = await supabase.from("chat_leads").insert({
      name,
      email,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Failed to save lead:", error);
      // Don't fail the request even if DB save fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json({ success: true }); // Don't block chat even on error
  }
}
