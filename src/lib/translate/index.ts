export type TranslateLanguage =
  | "en"
  | "zh"
  | "ja"
  | "ko"
  | "es"
  | "fr"
  | "de"
  | "ru"
  | "ar"
  | "pt"
  | "it"
  | "vi"
  | "th";

export const TRANSLATE_LANGUAGES: { code: TranslateLanguage; name: string }[] = [
  { code: "en", name: "English" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" },
  { code: "it", name: "Italian" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
];

export async function translateText(
  text: string,
  from: TranslateLanguage,
  to: TranslateLanguage
): Promise<string> {
  if (from === to) return text;
  if (!text.trim()) return "";

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${from}|${to}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    throw new Error("Translation failed");
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate text. Please try again.");
  }
}
