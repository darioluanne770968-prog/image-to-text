import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Image To Text Plans and Features",
  description:
    "Choose the perfect plan for your needs. Free tier available. Premium plans starting at $9.90/month with high-precision OCR, batch processing, and API access.",
  keywords: [
    "Image to Text pricing",
    "OCR pricing",
    "OCR subscription",
    "text extraction plans",
    "premium OCR",
  ],
  openGraph: {
    title: "Pricing - Image To Text",
    description:
      "Affordable plans for every need. Free tier available, premium from $9.90/month.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
