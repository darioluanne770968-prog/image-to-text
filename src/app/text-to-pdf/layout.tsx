import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text to PDF Converter - Create PDF from Text Online",
  description:
    "Free online text to PDF converter. Transform plain text into professional PDF documents. Customize fonts, margins, and formatting.",
  keywords: [
    "text to PDF",
    "convert text to PDF",
    "create PDF from text",
    "TXT to PDF",
    "free PDF creator",
  ],
  openGraph: {
    title: "Text to PDF Converter - Free Online Tool",
    description:
      "Convert text to PDF documents instantly. Easy to use, no registration required.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
