import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ConversionType } from "@/lib/supabase/database.types";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("conversions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching history:", error);
      return NextResponse.json(
        { error: "Failed to fetch history" },
        { status: 500 }
      );
    }

    return NextResponse.json({ history: data });
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, input_filename, input_format, output_text, language } = body as {
      type: ConversionType;
      input_filename: string;
      input_format: string;
      output_text: string;
      language: string;
    };

    if (!type || !input_filename || !output_text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("conversions")
      .insert({
        user_id: user.id,
        type,
        input_filename,
        input_format: input_format || "unknown",
        output_text,
        language: language || "eng",
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving conversion:", error);
      return NextResponse.json(
        { error: "Failed to save conversion" },
        { status: 500 }
      );
    }

    return NextResponse.json({ conversion: data });
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing conversion ID" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("conversions")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting conversion:", error);
      return NextResponse.json(
        { error: "Failed to delete conversion" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
