import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPG to Excel Converter - Extract Data from Images to Spreadsheet",
  description:
    "Free online JPG to Excel converter. Extract text and data from images directly into Excel spreadsheets (.xlsx). Perfect for tables and structured data.",
  keywords: [
    "JPG to Excel",
    "image to Excel",
    "convert image to spreadsheet",
    "extract data from image",
    "picture to Excel",
  ],
  openGraph: {
    title: "JPG to Excel Converter - Free Online Tool",
    description:
      "Convert JPG images to Excel spreadsheets. Extract tables and data easily.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
