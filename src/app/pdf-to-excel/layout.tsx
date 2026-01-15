import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Excel Converter - Extract Tables from PDF to Spreadsheet",
  description:
    "Free online PDF to Excel converter. Extract tables and data from PDF files into editable Excel spreadsheets (.xlsx). Fast and accurate conversion.",
  keywords: [
    "PDF to Excel",
    "PDF to XLSX",
    "extract tables from PDF",
    "PDF table extractor",
    "convert PDF to spreadsheet",
    "free PDF converter",
  ],
  openGraph: {
    title: "PDF to Excel Converter - Free Online Tool",
    description:
      "Extract tables from PDF to Excel spreadsheets. Accurate data extraction.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
