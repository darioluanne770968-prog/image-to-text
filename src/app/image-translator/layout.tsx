import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Translator - Translate Text in Images Online",
  description:
    "Free online image translator. Extract and translate text from images into multiple languages. OCR with built-in translation for photos and screenshots.",
  keywords: [
    "image translator",
    "translate image text",
    "photo translator",
    "OCR translation",
    "picture translator",
    "translate screenshot",
  ],
  openGraph: {
    title: "Image Translator - Free Online Tool",
    description:
      "Extract and translate text from images. Support for 25+ languages.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
