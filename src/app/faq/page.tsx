"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is Image to Text?",
    answer:
      "Image to Text is an online OCR (Optical Character Recognition) tool that extracts text from images. It supports various image formats including JPG, PNG, GIF, HEIC, and PDF files.",
  },
  {
    question: "Is Image to Text free to use?",
    answer:
      "Yes! Our basic OCR features are completely free. We also offer premium plans with higher limits, batch processing, and API access for power users.",
  },
  {
    question: "What languages are supported?",
    answer:
      "We support 15+ languages including English, Chinese (Simplified & Traditional), Japanese, Korean, Spanish, French, German, Italian, Portuguese, Russian, Arabic, Hindi, and more.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Absolutely! All image processing happens directly in your browser using local OCR technology. Your images are never uploaded to our servers, ensuring 100% privacy.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "We support most common image formats: JPG/JPEG, PNG, GIF, JFIF, HEIC, WebP, and PDF files.",
  },
  {
    question: "What is the maximum file size?",
    answer:
      "Free users can upload images up to 10MB. Premium users enjoy higher limits up to 50MB or 100MB depending on their plan.",
  },
  {
    question: "Can I extract text from handwritten notes?",
    answer:
      "Yes, our OCR can recognize handwritten text, though accuracy may vary depending on handwriting clarity. For best results, use clear, well-lit images.",
  },
  {
    question: "How accurate is the text extraction?",
    answer:
      "Accuracy depends on image quality and text clarity. For printed text with good resolution, accuracy is typically 95%+ . Premium plans offer access to our high-precision Azure Vision API for even better results.",
  },
  {
    question: "Can I convert images to Word or Excel?",
    answer:
      "Yes! We offer JPG to Word and JPG to Excel conversion. The extracted text is formatted and saved as downloadable .docx or .xlsx files.",
  },
  {
    question: "Is there an API available?",
    answer:
      "Yes, we offer a REST API for developers on our Pro and Enterprise plans. Check our API Documentation page for integration details.",
  },
  {
    question: "How do I report a bug or suggest a feature?",
    answer:
      "Please use our Contact page to report bugs or suggest new features. We appreciate your feedback and continuously work to improve our service.",
  },
  {
    question: "Do you offer batch processing?",
    answer:
      "Yes! You can upload and process up to 10 images at once using our Batch Upload feature. All results can be downloaded as a single combined file.",
  },
];

export default function FAQPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-muted-foreground">
            Find answers to common questions about our Image to Text service.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Still have questions?{" "}
            <a href="/contact" className="text-primary hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
