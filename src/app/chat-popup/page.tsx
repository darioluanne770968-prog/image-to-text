"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send, Bot, User, Mail, UserIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface LeadInfo {
  name: string;
  email: string;
}

const QUICK_REPLIES = [
  "How do I use this tool?",
  "What formats are supported?",
  "Tell me about pricing",
  "I need help with an issue",
];

export default function ChatPopupPage() {
  const [leadInfo, setLeadInfo] = useState<LeadInfo | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hide navbar and footer in popup
  useEffect(() => {
    // Hide navbar and footer
    const navbar = document.querySelector("nav");
    const footer = document.querySelector("footer");
    const chatWidget = document.querySelector('[class*="fixed bottom-6 right-6"]');

    if (navbar) navbar.style.display = "none";
    if (footer) footer.style.display = "none";
    if (chatWidget) (chatWidget as HTMLElement).style.display = "none";

    // Update document title
    document.title = "Chat Support - ImageToText";

    return () => {
      if (navbar) navbar.style.display = "";
      if (footer) footer.style.display = "";
      if (chatWidget) (chatWidget as HTMLElement).style.display = "";
    };
  }, []);

  // Load state from sessionStorage on mount
  useEffect(() => {
    const savedState = sessionStorage.getItem("chatPopupState");
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.leadInfo) setLeadInfo(state.leadInfo);
        if (state.messages) setMessages(state.messages);
        if (state.name) setName(state.name);
        if (state.email) setEmail(state.email);
        sessionStorage.removeItem("chatPopupState");
      } catch (e) {
        console.error("Failed to parse chat state:", e);
      }
    }
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmittingLead(true);

    try {
      await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      setLeadInfo({ name: name.trim(), email: email.trim() });
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hi ${name.trim()}! 👋 Thanks for reaching out. How can I help you today?\n\nYou can ask me anything or choose from the quick options below.`,
        },
      ]);
    } catch (error) {
      console.error("Failed to save lead:", error);
      setLeadInfo({ name: name.trim(), email: email.trim() });
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hi ${name.trim()}! How can I help you today?`,
        },
      ]);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || !leadInfo) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadInfo.name,
          email: leadInfo.email,
          message: text.trim(),
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.autoReply || "Thanks for your message! Our team will get back to you via email shortly.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Thanks for your message! Our team will review it and get back to you via email.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 py-4 px-6 border-b bg-primary text-primary-foreground">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-lg">Support Team</span>
          <span className="text-sm opacity-80">ImageToText - We typically reply within hours</span>
        </div>
      </div>

      {!leadInfo ? (
        // Lead Capture Form
        <div className="flex-1 flex flex-col justify-center p-8 max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-semibold text-2xl mb-2">Let&apos;s chat!</h2>
            <p className="text-muted-foreground">
              Fill in your details to get started. We&apos;ll respond via email.
            </p>
          </div>

          <form onSubmit={handleLeadSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="popup-name" className="flex items-center gap-2 text-base">
                <UserIcon className="h-5 w-5" />
                Name
              </Label>
              <Input
                id="popup-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="popup-email" className="flex items-center gap-2 text-base">
                <Mail className="h-5 w-5" />
                Email
              </Label>
              <Input
                id="popup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="h-12 text-base"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isSubmittingLead || !name.trim() || !email.trim()}
            >
              {isSubmittingLead ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                "Start the chat"
              )}
            </Button>
          </form>
        </div>
      ) : (
        // Chat Interface
        <>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {QUICK_REPLIES.map((reply) => (
                  <Button
                    key={reply}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            )}

            {isSending && (
              <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 h-12"
                disabled={isSending}
              />
              <Button type="submit" size="lg" disabled={isSending || !input.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
