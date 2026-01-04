"use client";

import { useState, useCallback } from "react";
import { ImageUploader } from "@/components/upload/image-uploader";
import { LanguageSelector } from "@/components/ocr/language-selector";
import { OCRModeSelector, type OCRMode } from "@/components/ocr/ocr-mode-selector";
import {
  recognizeText,
  formatOCRResult,
  type LanguageCode,
  type OCRProgress,
} from "@/lib/ocr/tesseract";
import { createWordDocument, downloadBlob } from "@/lib/convert/to-word";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  FileText,
  Download,
  RotateCcw,
  Check,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

export default function JpgToWordPage() {
  const [language, setLanguage] = useState<LanguageCode>("auto");
  const [ocrMode, setOCRMode] = useState<OCRMode>("simple");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleImageSelect = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setProgress(0);
      setProgressStatus("Recognizing text...");
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

        const formattedText = formatOCRResult(
          ocrResult,
          ocrMode === "formatted"
        );
        setResult(formattedText);
        setProgress(100);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to process image. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    },
    [language, ocrMode]
  );

  const handleDownloadWord = async () => {
    if (!result) return;

    try {
      const blob = await createWordDocument(result, undefined, {
        title: "Extracted Text from Image",
        formatted: ocrMode === "formatted",
      });
      downloadBlob(blob, "extracted-text.docx");
      toast.success("Word document downloaded!");
    } catch (error) {
      console.error("Error creating Word document:", error);
      toast.error("Failed to create Word document");
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

  const handleReset = () => {
    setResult("");
    setProgress(0);
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            JPG to Word Converter
          </h1>
          <p className="text-muted-foreground text-lg">
            Convert images to editable Word documents with OCR technology.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8 space-y-6">
            <ImageUploader
              onImageSelect={handleImageSelect}
              isProcessing={isProcessing}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <OCRModeSelector
                mode={ocrMode}
                onModeChange={setOCRMode}
                disabled={isProcessing}
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <span className="text-sm text-muted-foreground">Language:</span>
              <LanguageSelector
                value={language}
                onChange={setLanguage}
                disabled={isProcessing}
              />
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground text-center capitalize">
                  {progressStatus}: {progress}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {result && !isProcessing && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Extracted Text
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  Copy
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownloadWord}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Word
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                value={result}
                readOnly
                className="w-full h-64 p-4 bg-muted/50 rounded-lg border resize-none text-sm font-mono"
              />
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>*Your privacy is protected! No data is transmitted or stored.</span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-8">
          <FeatureCard
            title="Image to Word"
            description="Convert JPG, PNG, GIF and other image formats to editable Word documents."
          />
          <FeatureCard
            title="Preserve Formatting"
            description="Maintain text structure, paragraphs and layout in the output document."
          />
          <FeatureCard
            title="Multi-Language"
            description="Support for English, Chinese, Japanese, Korean and 15+ languages."
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
