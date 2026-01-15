import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to PDF Converter - Combine Images into PDF",
  description:
    "Free online image to PDF converter. Combine multiple JPG, PNG images into a single PDF document. Arrange, reorder, and convert instantly.",
  keywords: [
    "image to PDF",
    "JPG to PDF",
    "PNG to PDF",
    "combine images to PDF",
    "merge images PDF",
    "picture to PDF",
  ],
  openGraph: {
    title: "Image to PDF Converter - Free Online Tool",
    description:
      "Convert and combine images into PDF documents. Fast and easy to use.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
