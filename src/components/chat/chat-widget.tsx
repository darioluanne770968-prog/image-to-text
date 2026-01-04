"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const FAQ_RESPONSES: Record<string, string> = {
  "how to use": "Simply upload an image by dragging and dropping, or click the Browse button. Select your language and click Convert to extract text.",
  "supported formats": "We support JPG, PNG, GIF, JFIF, HEIC, WebP, and PDF formats.",
  "languages": "We support 15+ languages including English, Chinese (Simplified & Traditional), Japanese, Korean, Spanish, French, German, and more.",
  "pricing": "We offer Free, Basic ($9.9/mo), Pro ($19.9/mo), and Enterprise ($49.9/mo) plans. Visit our Pricing page for details.",
  "history": "Your conversion history is saved when you're logged in. Visit the History page to view past conversions.",
  "batch": "Yes! You can upload multiple images at once. We process up to 3 images in parallel for faster results.",
  "accuracy": "OCR accuracy depends on image quality. For best results, use clear, high-resolution images with good contrast.",
  "privacy": "Your privacy is protected. Free tier processing happens entirely in your browser. No data is uploaded to our servers.",
  "api": "API access is available for Pro and Enterprise plans. Check our documentation for integration details.",
  "contact": "You can reach us through the Contact page or email support@imagetotext.info",
};

function findResponse(input: string): string {
  const lowerInput = input.toLowerCase();

  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (lowerInput.includes(key)) {
      return response;
    }
  }

  if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey")) {
    return "Hello! How can I help you today? You can ask about: how to use, supported formats, languages, pricing, batch processing, or privacy.";
  }

  if (lowerInput.includes("thank")) {
    return "You're welcome! Is there anything else I can help you with?";
  }

  return "I'm not sure I understand. You can ask about:\n• How to use the tool\n• Supported formats\n• Available languages\n• Pricing plans\n• Batch processing\n• Privacy & security\n\nOr contact our support team for more help.";
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your virtual assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate typing delay
    setTimeout(() => {
      const response = findResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50",
          isOpen && "hidden"
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Chat Support
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>

          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
