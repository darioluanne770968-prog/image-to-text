import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// API Key validation
async function validateApiKey(apiKey: string | null) {
  if (!apiKey) {
    return { valid: false, error: "API key is required" };
  }

  const supabase = await createClient();

  // Check if API key exists and is valid
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, user_id, name, rate_limit, requests_today, last_reset")
    .eq("key", apiKey)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return { valid: false, error: "Invalid API key" };
  }

  // Check rate limit
  const now = new Date();
  const lastReset = new Date(data.last_reset);
  const shouldReset = now.getDate() !== lastReset.getDate();

  if (shouldReset) {
    // Reset daily counter
    await supabase
      .from("api_keys")
      .update({ requests_today: 0, last_reset: now.toISOString() })
      .eq("id", data.id);
    data.requests_today = 0;
  }

  if (data.requests_today >= data.rate_limit) {
    return { valid: false, error: "Rate limit exceeded" };
  }

  // Increment request count
  await supabase
    .from("api_keys")
    .update({ requests_today: data.requests_today + 1 })
    .eq("id", data.id);

  return { valid: true, userId: data.user_id };
}

export async function POST(request: NextRequest) {
  try {
    // Get API key from header
    const apiKey = request.headers.get("x-api-key");
    const validation = await validateApiKey(apiKey);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 401 }
      );
    }

    // Parse request body
    const contentType = request.headers.get("content-type") || "";
    let imageData: string | null = null;
    let language = "eng";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("image") as File | null;
      language = (formData.get("language") as string) || "eng";

      if (!file) {
        return NextResponse.json(
          { error: "Image file is required" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mimeType = file.type || "image/jpeg";
      imageData = `data:${mimeType};base64,${base64}`;
    } else if (contentType.includes("application/json")) {
      const body = await request.json();
      imageData = body.image; // Expect base64 data URL
      language = body.language || "eng";

      if (!imageData) {
        return NextResponse.json(
          { error: "Image data is required" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 415 }
      );
    }

    // For now, return a placeholder response
    // In production, this would call Azure Vision API or similar
    return NextResponse.json({
      success: true,
      data: {
        text: "API OCR processing is available for Pro and Enterprise plans. This is a placeholder response.",
        confidence: 0.95,
        language,
        words: [],
      },
      usage: {
        credits_used: 1,
      },
    });
  } catch (error) {
    console.error("API OCR error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Image to Text API",
    version: "1.0.0",
    endpoints: {
      ocr: {
        method: "POST",
        path: "/api/v1/ocr",
        description: "Extract text from an image",
        headers: {
          "x-api-key": "Your API key (required)",
          "Content-Type": "multipart/form-data or application/json",
        },
        body: {
          image: "Image file or base64 data URL",
          language: "OCR language code (default: eng)",
        },
        response: {
          text: "Extracted text",
          confidence: "Confidence score (0-1)",
          language: "Detected/used language",
        },
      },
    },
    documentation: "/api-docs",
  });
}
