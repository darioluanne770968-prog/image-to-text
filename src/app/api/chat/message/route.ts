import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Smart auto-replies based on message content
function getAutoReply(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Greeting
  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return "Hello! Thanks for reaching out. Our team will review your message and get back to you via email within 24 hours. Is there anything specific I can help you with in the meantime?";
  }

  // How to use
  if (
    lowerMessage.includes("how") &&
    (lowerMessage.includes("use") || lowerMessage.includes("work"))
  ) {
    return "Great question! Here's how to use our tool:\n\n1. Upload an image (drag & drop or click Browse)\n2. Select the language of your text\n3. Click 'Extract Text'\n4. Copy or download your results\n\nIf you need more help, our team will follow up via email!";
  }

  // Formats
  if (
    lowerMessage.includes("format") ||
    lowerMessage.includes("support") ||
    lowerMessage.includes("file")
  ) {
    return "We support multiple formats:\n\n• Images: JPG, PNG, GIF, WebP, HEIC\n• Documents: PDF\n\nFor best results, use clear, high-resolution images. Our team will reach out if you have more questions!";
  }

  // Pricing
  if (
    lowerMessage.includes("price") ||
    lowerMessage.includes("pricing") ||
    lowerMessage.includes("cost") ||
    lowerMessage.includes("plan")
  ) {
    return "We offer flexible pricing:\n\n• Free: Basic OCR with browser processing\n• Basic ($9.9/mo): More features\n• Pro ($19.9/mo): API access included\n• Enterprise ($49.9/mo): Unlimited usage\n\nVisit our Pricing page for full details. Our team can help with custom plans too!";
  }

  // Issues/Problems
  if (
    lowerMessage.includes("issue") ||
    lowerMessage.includes("problem") ||
    lowerMessage.includes("error") ||
    lowerMessage.includes("not working") ||
    lowerMessage.includes("help")
  ) {
    return "I'm sorry to hear you're having issues! Please describe the problem in detail and our team will investigate. Include:\n\n• What you were trying to do\n• What happened instead\n• The type of image you used\n\nWe'll get back to you via email as soon as possible!";
  }

  // API
  if (lowerMessage.includes("api") || lowerMessage.includes("integrate")) {
    return "API access is available with our Pro and Enterprise plans! It includes:\n\n• RESTful API endpoints\n• API key authentication\n• Rate limiting based on your plan\n• Documentation and examples\n\nOur team will send you more details via email!";
  }

  // Languages
  if (
    lowerMessage.includes("language") ||
    lowerMessage.includes("chinese") ||
    lowerMessage.includes("spanish") ||
    lowerMessage.includes("japanese")
  ) {
    return "We support 25+ languages including:\n\n• English, Chinese (Simplified & Traditional)\n• Japanese, Korean\n• Spanish, French, German\n• Arabic, Hindi, and many more\n\nSelect your language from the dropdown before extracting text!";
  }

  // Default response
  return "Thanks for your message! Our support team has been notified and will get back to you via email within 24 hours.\n\nIn the meantime, you can:\n• Check our FAQ page for quick answers\n• Try our tool at the homepage\n• Browse our pricing options";
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Save message to Supabase
    const { error: dbError } = await supabase.from("chat_messages").insert({
      name,
      email,
      message,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("Failed to save message:", dbError);
    }

    // Send email notification (if Resend is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "ImageToText <noreply@imagetotext-orcin-seven.vercel.app>",
            to: process.env.NOTIFICATION_EMAIL || "your-email@example.com",
            subject: `New Chat Message from ${name}`,
            html: `
              <h2>New Chat Message</h2>
              <p><strong>From:</strong> ${name} (${email})</p>
              <p><strong>Message:</strong></p>
              <blockquote style="border-left: 3px solid #ccc; padding-left: 10px; margin: 10px 0;">
                ${message}
              </blockquote>
              <p><a href="mailto:${email}?subject=Re: Your message to ImageToText">Reply to ${name}</a></p>
            `,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    }

    // Get smart auto-reply
    const autoReply = getAutoReply(message);

    return NextResponse.json({ success: true, autoReply });
  } catch (error) {
    console.error("Message API error:", error);
    return NextResponse.json({
      success: true,
      autoReply:
        "Thanks for your message! Our team will get back to you via email soon.",
    });
  }
}
