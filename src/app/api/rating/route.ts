import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const body = await request.json();
    const { rating, feedback, page } = body as {
      rating: number;
      feedback?: string;
      page: string;
    };

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!page) {
      return NextResponse.json(
        { error: "Page is required" },
        { status: 400 }
      );
    }

    // Get user if logged in (optional)
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("ratings")
      .insert({
        user_id: user?.id || null,
        rating,
        feedback: feedback || null,
        page,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving rating:", error);
      return NextResponse.json(
        { error: "Failed to save rating" },
        { status: 500 }
      );
    }

    return NextResponse.json({ rating: data });
  } catch (error) {
    console.error("Rating API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");

    let query = supabase
      .from("ratings")
      .select("rating");

    if (page) {
      query = query.eq("page", page);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching ratings:", error);
      return NextResponse.json(
        { error: "Failed to fetch ratings" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        averageRating: 0,
        totalRatings: 0,
      });
    }

    const totalRatings = data.length;
    const averageRating = data.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    return NextResponse.json({
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings,
    });
  } catch (error) {
    console.error("Rating API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
