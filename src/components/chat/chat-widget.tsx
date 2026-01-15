"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User, Mail, UserIcon, Loader2, Maximize2, Minimize2, ExternalLink } from "lucide-react";
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

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [leadInfo, setLeadInfo] = useState<LeadInfo | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmittingLead(true);

    try {
      // Save lead info to API
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
      // Still allow chat even if lead save fails
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
      // Send message to API for notification
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

      // Show auto-reply
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

  const handlePopout = () => {
    // Store current state in sessionStorage for the popup to use
    const chatState = {
      leadInfo,
      messages,
      name,
      email,
    };
    sessionStorage.setItem("chatPopupState", JSON.stringify(chatState));

    // Open popup window
    const width = 420;
    const height = 600;
    const left = window.screen.width - width - 20;
    const top = 100;

    window.open(
      "/chat-popup",
      "ChatPopup",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no`
    );

    // Close the embedded widget
    setIsOpen(false);
  };

  // Window size classes based on expanded state
  const windowClasses = isExpanded
    ? "fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[480px] h-full sm:h-[700px] sm:rounded-lg"
    : "fixed bottom-6 right-6 w-80 sm:w-96 h-[500px]";

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
        <Card className={cn(windowClasses, "shadow-2xl z-50 flex flex-col")}>
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Support Team</span>
                <span className="text-xs opacity-80">We typically reply within hours</span>
              </div>
            </CardTitle>
            <div className="flex items-center gap-1">
              {/* Popout Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-white/20 text-primary-foreground"
                onClick={handlePopout}
                title="Open in new window"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              {/* Expand/Minimize Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-white/20 text-primary-foreground"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-white/20 text-primary-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!leadInfo ? (
            // Lead Capture Form
            <CardContent className="flex-1 flex flex-col justify-center p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Let&apos;s chat!</h3>
                <p className="text-sm text-muted-foreground">
                  Fill in your details to get started. We&apos;ll respond via email.
                </p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chat-name" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Name
                  </Label>
                  <Input
                    id="chat-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chat-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="chat-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmittingLead || !name.trim() || !email.trim()}
                >
                  {isSubmittingLead ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    "Start the chat"
                  )}
                </Button>
              </form>
            </CardContent>
          ) : (
            // Chat Interface
            <>
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

                {/* Quick Replies - Show after first message */}
                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {QUICK_REPLIES.map((reply) => (
                      <Button
                        key={reply}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleQuickReply(reply)}
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                )}

                {isSending && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
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
                    disabled={isSending}
                  />
                  <Button type="submit" size="icon" disabled={isSending || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
}
