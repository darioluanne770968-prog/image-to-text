import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const AZURE_ENDPOINT = process.env.AZURE_VISION_ENDPOINT;
const AZURE_KEY = process.env.AZURE_VISION_KEY;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!AZURE_ENDPOINT || !AZURE_KEY) {
      return NextResponse.json(
        { error: "Azure Vision API not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const language = formData.get("language") as string || "en";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const analyzeUrl = `${AZURE_ENDPOINT}/vision/v3.2/read/analyze?language=${language}`;

    const analyzeResponse = await fetch(analyzeUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_KEY,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    });

    if (!analyzeResponse.ok) {
      throw new Error(`Azure API error: ${analyzeResponse.statusText}`);
    }

    const operationLocation = analyzeResponse.headers.get("Operation-Location");

    if (!operationLocation) {
      throw new Error("No operation location returned");
    }

    let result = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const resultResponse = await fetch(operationLocation, {
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_KEY,
        },
      });

      const resultData = await resultResponse.json();

      if (resultData.status === "succeeded") {
        result = resultData;
        break;
      } else if (resultData.status === "failed") {
        throw new Error("OCR processing failed");
      }

      attempts++;
    }

    if (!result) {
      throw new Error("OCR timeout");
    }

    const extractedText = result.analyzeResult?.readResults
      ?.map((page: { lines: { text: string }[] }) =>
        page.lines.map((line: { text: string }) => line.text).join("\n")
      )
      .join("\n\n") || "";

    return NextResponse.json({
      text: extractedText,
      confidence: 0.95,
    });
  } catch (error) {
    console.error("Azure OCR error:", error);
    return NextResponse.json(
      { error: "OCR processing failed" },
      { status: 500 }
    );
  }
}
