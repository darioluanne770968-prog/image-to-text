import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Support - ImageToText",
  description: "Chat with our support team",
};

export default function ChatPopupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Minimal layout for popup - no navbar, footer, or chat widget
  return <>{children}</>;
}
