import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Batch Image to Text - Convert Multiple Images at Once",
  description:
    "Free batch OCR tool. Convert multiple images to text simultaneously. Upload up to 20 images and extract text from all of them at once.",
  keywords: [
    "batch OCR",
    "batch image to text",
    "multiple image converter",
    "bulk OCR",
    "mass image to text",
  ],
  openGraph: {
    title: "Batch Image to Text Converter - Free Online Tool",
    description:
      "Convert multiple images to text at once. Fast batch OCR processing.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
