import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/lib/i18n/context";
import { ChatWidget } from "@/components/chat/chat-widget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const BASE_URL = "https://imagetotext-orcin-seven.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Image to Text Converter - Free Online OCR Tool",
    template: "%s | Image To Text",
  },
  description:
    "Free online OCR tool to extract text from images. Convert JPG, PNG, PDF to editable text instantly. Supports 25+ languages with high accuracy.",
  keywords: [
    "image to text",
    "OCR",
    "text extractor",
    "JPG to text",
    "PNG to text",
    "PDF to text",
    "image converter",
    "free OCR",
    "online OCR",
    "extract text from image",
    "picture to text",
    "photo to text",
  ],
  authors: [{ name: "Image To Text" }],
  creator: "Image To Text",
  publisher: "Image To Text",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Image to Text Converter - Free Online OCR Tool",
    description:
      "Extract text from images instantly. Free OCR tool supporting JPG, PNG, PDF and 25+ languages.",
    url: BASE_URL,
    siteName: "Image To Text",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to Text Converter - Free Online OCR Tool",
    description:
      "Extract text from images instantly. Free OCR tool supporting JPG, PNG, PDF and 25+ languages.",
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-google-verification-code",
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
          <ChatWidget />
        </I18nProvider>
      </body>
    </html>
  );
}
