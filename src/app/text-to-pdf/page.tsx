"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default function TextToPDFPage() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [fontSize, setFontSize] = useState("12");
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text");
      return;
    }

    setIsGenerating(true);

    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const size = parseInt(fontSize);

      const pageWidth = 595.28; // A4 width in points
      const pageHeight = 841.89; // A4 height in points
      const margin = 50;
      const lineHeight = size * 1.5;
      const maxWidth = pageWidth - margin * 2;

      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      // Add title if provided
      if (title.trim()) {
        page.drawText(title.trim(), {
          x: margin,
          y: y,
          size: size + 6,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight * 2;
      }

      // Split text into lines
      const lines = text.split("\n");

      for (const line of lines) {
        // Word wrap long lines
        const words = line.split(" ");
        let currentLine = "";

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(testLine, size);

          if (textWidth > maxWidth && currentLine) {
            // Draw current line and start new one
            if (y < margin + lineHeight) {
              page = pdfDoc.addPage([pageWidth, pageHeight]);
              y = pageHeight - margin;
            }

            page.drawText(currentLine, {
              x: margin,
              y: y,
              size: size,
              font: font,
              color: rgb(0, 0, 0),
            });
            y -= lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }

        // Draw remaining text in line
        if (currentLine) {
          if (y < margin + lineHeight) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }

          page.drawText(currentLine, {
            x: margin,
            y: y,
            size: size,
            font: font,
            color: rgb(0, 0, 0),
          });
        }
        y -= lineHeight;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = (title.trim() || "document") + ".pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Text to PDF Converter
          </h1>
          <p className="text-muted-foreground">
            Convert your text into a professional PDF document
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="Enter document title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10pt</SelectItem>
                    <SelectItem value="11">11pt</SelectItem>
                    <SelectItem value="12">12pt</SelectItem>
                    <SelectItem value="14">14pt</SelectItem>
                    <SelectItem value="16">16pt</SelectItem>
                    <SelectItem value="18">18pt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text">Text Content</Label>
              <Textarea
                id="text"
                placeholder="Enter or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[300px] font-mono"
              />
              <p className="text-sm text-muted-foreground text-right">
                {text.length} characters
              </p>
            </div>

            <Button
              onClick={generatePDF}
              disabled={isGenerating || !text.trim()}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate & Download PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Features
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <li>• Automatic page breaks</li>
              <li>• Word wrapping for long lines</li>
              <li>• A4 page format</li>
              <li>• Customizable font size</li>
              <li>• Optional document title</li>
              <li>• 100% client-side processing</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
