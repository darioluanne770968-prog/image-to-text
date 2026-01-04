"use client";

import { useState, useCallback } from "react";
import { ImageUploader } from "@/components/upload/image-uploader";
import { LanguageSelector } from "@/components/ocr/language-selector";
import {
  recognizeText,
  type LanguageCode,
  type OCRProgress,
} from "@/lib/ocr/tesseract";
import { createWordDocument, downloadBlob } from "@/lib/convert/to-word";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Download,
  Copy,
  Loader2,
  Check,
  Shield,
  FileUp,
} from "lucide-react";
import { toast } from "sonner";

export default function PdfToWordPage() {
  const [language, setLanguage] = useState<LanguageCode>("auto");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleImageSelect = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setProgress(0);
      setProgressStatus("Processing PDF...");
      setResult("");

      try {
        const ocrResult = await recognizeText(
          file,
          language,
          (p: OCRProgress) => {
            setProgress(Math.round(p.progress * 0.8));
            setProgressStatus(p.status);
          }
        );

        setResult(ocrResult.text.trim());
        setProgress(100);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to process PDF. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    },
    [language]
  );

  const handleDownloadWord = async () => {
    if (!result) return;

    try {
      const blob = await createWordDocument(result, undefined, {
        title: "Extracted from PDF",
        formatted: true,
      });
      downloadBlob(blob, "converted-document.docx");
      toast.success("Word document downloaded!");
    } catch (error) {
      console.error("Error creating Word:", error);
      toast.error("Failed to create Word file");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="container py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <FileUp className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              PDF to Word
            </h1>
          </div>
          <p className="text-muted-foreground">
            Convert PDF documents to editable Word files with OCR
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upload PDF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUploader
              onImageSelect={handleImageSelect}
              isProcessing={isProcessing}
            />
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground">Language:</span>
              <LanguageSelector
                value={language}
                onChange={setLanguage}
                disabled={isProcessing}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground italic">
          <Shield className="h-4 w-4" />
          <span>*Your privacy is protected! No data is transmitted or stored.</span>
        </div>

        {isProcessing && (
          <Card>
            <CardContent className="py-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{progressStatus}</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </CardContent>
          </Card>
        )}

        {result && !isProcessing && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Extracted Text
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    Copy
                  </Button>
                  <Button size="sm" onClick={handleDownloadWord}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Word
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap">{result}</pre>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          <FeatureCard
            title="PDF Support"
            description="Upload PDF files and extract text content using advanced OCR technology."
          />
          <FeatureCard
            title="Editable Output"
            description="Get a fully editable Word document that you can modify as needed."
          />
          <FeatureCard
            title="Multi-Language"
            description="Supports text extraction in 15+ languages including Chinese, Japanese, and Korean."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
