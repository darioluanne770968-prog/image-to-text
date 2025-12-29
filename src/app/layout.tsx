import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/lib/i18n/context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Image to Text Converter - Free Online OCR Tool",
  description:
    "An online image to text converter to extract text from images. Supports JPG, PNG, GIF, PDF and more. Free OCR tool with multi-language support.",
  keywords: [
    "image to text",
    "OCR",
    "text extractor",
    "JPG to text",
    "PNG to text",
    "image converter",
    "free OCR",
  ],
  openGraph: {
    title: "Image to Text Converter - Free Online OCR Tool",
    description:
      "Extract text from images instantly. Supports multiple formats and languages.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <I18nProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
