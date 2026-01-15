import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - OCR Tutorials & Guides",
  description:
    "Learn how to extract text from images, convert documents to different formats, and master OCR technology. Free tutorials and comprehensive guides.",
  keywords: [
    "OCR tutorial",
    "image to text guide",
    "document conversion",
    "text extraction",
    "OCR tips",
    "PDF conversion guide",
  ],
  openGraph: {
    title: "Blog - OCR Tutorials & Guides | Image To Text",
    description:
      "Free tutorials and guides for OCR, document conversion, and text extraction.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
