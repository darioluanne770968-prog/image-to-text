import Tesseract from "tesseract.js";

export interface OCRProgress {
  status: string;
  progress: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
}

export type LanguageCode =
  | "eng"
  | "chi_sim"
  | "chi_tra"
  | "jpn"
  | "kor"
  | "spa"
  | "fra"
  | "deu"
  | "rus"
  | "ara"
  | "hin"
  | "por"
  | "ita"
  | "vie"
  | "tha";

export const LANGUAGES: { code: LanguageCode; name: string }[] = [
  { code: "eng", name: "English" },
  { code: "chi_sim", name: "Chinese (Simplified)" },
  { code: "chi_tra", name: "Chinese (Traditional)" },
  { code: "jpn", name: "Japanese" },
  { code: "kor", name: "Korean" },
  { code: "spa", name: "Spanish" },
  { code: "fra", name: "French" },
  { code: "deu", name: "German" },
  { code: "rus", name: "Russian" },
  { code: "ara", name: "Arabic" },
  { code: "hin", name: "Hindi" },
  { code: "por", name: "Portuguese" },
  { code: "ita", name: "Italian" },
  { code: "vie", name: "Vietnamese" },
  { code: "tha", name: "Thai" },
];

export async function recognizeText(
  image: File | string,
  language: LanguageCode | LanguageCode[] = "eng",
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
  const langString = Array.isArray(language) ? language.join("+") : language;

  const result = await Tesseract.recognize(image, langString, {
    logger: (m) => {
      if (onProgress && m.status && typeof m.progress === "number") {
        onProgress({
          status: m.status,
          progress: Math.round(m.progress * 100),
        });
      }
    },
  });

  return {
    text: result.data.text,
    confidence: result.data.confidence,
  };
}

export function formatOCRResult(result: OCRResult, formatted: boolean): string {
  if (!formatted) {
    return result.text.trim();
  }

  // For formatted output, we preserve paragraph breaks
  const text = result.text.trim();
  const paragraphs = text.split(/\n\s*\n/);

  return paragraphs
    .map((para) => para.trim())
    .filter((para) => para.length > 0)
    .join("\n\n");
}
