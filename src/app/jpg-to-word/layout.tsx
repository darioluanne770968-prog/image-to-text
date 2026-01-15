import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPG to Word Converter - Convert Images to Editable Word Documents",
  description:
    "Free online JPG to Word converter. Extract text from JPG images and save as editable Word documents (.docx). Fast, accurate OCR with multi-language support.",
  keywords: [
    "JPG to Word",
    "image to Word",
    "convert JPG to DOCX",
    "picture to Word",
    "OCR to Word",
    "free JPG converter",
  ],
  openGraph: {
    title: "JPG to Word Converter - Free Online Tool",
    description:
      "Convert JPG images to editable Word documents instantly. Free OCR tool with high accuracy.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
