import Tesseract from "tesseract.js";

export interface OCRProgress {
  status: string;
  progress: number;
}

export interface WordData {
  text: string;
  bbox: { x0: number; y0: number; x1: number; y1: number };
  confidence: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  words?: WordData[];
}

export type LanguageCode =
  | "auto"
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

// Auto-detect uses common languages together
// Note: Only chi_sim is included to avoid mixing simplified/traditional Chinese characters
const AUTO_DETECT_LANGUAGES = ["eng", "chi_sim", "jpn", "kor"];

export const LANGUAGES: { code: LanguageCode; name: string }[] = [
  { code: "auto", name: "Auto Detect" },
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

export function getLanguageString(language: LanguageCode | LanguageCode[]): string {
  if (language === "auto") {
    return AUTO_DETECT_LANGUAGES.join("+");
  }
  return Array.isArray(language) ? language.join("+") : language;
}

export async function recognizeText(
  image: File | string,
  language: LanguageCode | LanguageCode[] = "auto",
  onProgress?: (progress: OCRProgress) => void,
  includeWordData: boolean = false
): Promise<OCRResult> {
  const langString = getLanguageString(language);

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

  const ocrResult: OCRResult = {
    text: result.data.text,
    confidence: result.data.confidence,
  };

  // Extract word data with positions for table detection
  const dataWithWords = result.data as { words?: Array<{ text: string; bbox: { x0: number; y0: number; x1: number; y1: number }; confidence: number }> };
  if (includeWordData && dataWithWords.words) {
    ocrResult.words = dataWithWords.words.map((word) => ({
      text: word.text,
      bbox: word.bbox,
      confidence: word.confidence,
    }));
  }

  return ocrResult;
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
