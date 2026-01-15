import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Scanner - Free Online QR Code Reader",
  description:
    "Free online QR code scanner. Upload QR code images to decode and extract URLs, text, and data instantly. No app installation required.",
  keywords: [
    "QR code scanner",
    "QR reader",
    "scan QR code online",
    "QR code decoder",
    "free QR scanner",
    "barcode reader",
  ],
  openGraph: {
    title: "QR Code Scanner - Free Online Tool",
    description:
      "Scan and decode QR codes online. Extract URLs and text from QR code images instantly.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
