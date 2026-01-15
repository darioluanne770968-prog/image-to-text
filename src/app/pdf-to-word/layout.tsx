import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Word Converter - Convert PDF to Editable DOCX Online",
  description:
    "Free online PDF to Word converter. Transform PDF documents into editable Word files (.docx) with accurate formatting. No registration required.",
  keywords: [
    "PDF to Word",
    "PDF to DOCX",
    "convert PDF",
    "PDF converter",
    "free PDF to Word",
    "online PDF converter",
  ],
  openGraph: {
    title: "PDF to Word Converter - Free Online Tool",
    description:
      "Convert PDF to editable Word documents instantly. Preserve formatting and layout.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
