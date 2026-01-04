import { NextRequest, NextResponse } from "next/server";

const GOOGLE_VISION_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;
const GOOGLE_VISION_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

export async function POST(request: NextRequest) {
  try {
    if (!GOOGLE_VISION_API_KEY) {
      return NextResponse.json(
        { error: "Google Cloud API key not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const languageHints = formData.get("language") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Prepare request body
    const requestBody = {
      requests: [
        {
          image: {
            content: base64,
          },
          features: [
            {
              type: "TEXT_DETECTION",
              maxResults: 1,
            },
          ],
          imageContext: languageHints
            ? {
                languageHints: [languageHints],
              }
            : undefined,
        },
      ],
    };

    // Call Google Vision API
    const response = await fetch(GOOGLE_VISION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google Vision API error:", errorData);
      return NextResponse.json(
        { error: "Google Vision API request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract text from response
    const textAnnotations = data.responses?.[0]?.textAnnotations;
    const fullTextAnnotation = data.responses?.[0]?.fullTextAnnotation;

    if (!textAnnotations || textAnnotations.length === 0) {
      return NextResponse.json({
        text: "",
        confidence: 0,
        message: "No text detected in image",
      });
    }

    // First annotation contains the full text
    const extractedText = textAnnotations[0]?.description || "";

    // Calculate average confidence if available
    let confidence = 0.95; // Default high confidence for Google Vision
    if (fullTextAnnotation?.pages) {
      const confidences: number[] = [];
      fullTextAnnotation.pages.forEach((page: { blocks?: Array<{ confidence?: number }> }) => {
        page.blocks?.forEach((block) => {
          if (block.confidence) {
            confidences.push(block.confidence);
          }
        });
      });
      if (confidences.length > 0) {
        confidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
      }
    }

    return NextResponse.json({
      text: extractedText,
      confidence,
      words: textAnnotations.slice(1).map((annotation: { description: string; boundingPoly?: { vertices?: Array<{ x: number; y: number }> } }) => ({
        text: annotation.description,
        boundingBox: annotation.boundingPoly?.vertices,
      })),
    });
  } catch (error) {
    console.error("Google Vision OCR error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
