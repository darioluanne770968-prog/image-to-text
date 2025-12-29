"use client";

import { useState, useCallback } from "react";
import { ImageUploader } from "@/components/upload/image-uploader";
import { OCRModeSelector, type OCRMode } from "@/components/ocr/ocr-mode-selector";
import { OCRResult } from "@/components/ocr/ocr-result";
import { LanguageSelector } from "@/components/ocr/language-selector";
import {
  recognizeText,
  formatOCRResult,
  type LanguageCode,
  type OCRProgress,
} from "@/lib/ocr/tesseract";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/rating/star-rating";
import { Shield } from "lucide-react";

export default function Home() {
  const [ocrMode, setOCRMode] = useState<OCRMode>("simple");
  const [language, setLanguage] = useState<LanguageCode>("eng");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const [result, setResult] = useState("");

  const handleImageSelect = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setProgress(0);
      setProgressStatus("");
      setResult("");

      try {
        const ocrResult = await recognizeText(
          file,
          language,
          (p: OCRProgress) => {
            setProgress(p.progress);
            setProgressStatus(p.status);
          }
        );

        const formattedText = formatOCRResult(
          ocrResult,
          ocrMode === "formatted"
        );
        setResult(formattedText);
      } catch (error) {
        console.error("OCR Error:", error);
        setResult("Error: Failed to process image. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    },
    [language, ocrMode]
  );

  const handleReset = () => {
    setResult("");
    setProgress(0);
    setProgressStatus("");
  };

  return (
    <div className="container py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Image to Text Converter
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            An online image to text converter to extract text from images.
          </p>
        </div>

        <Card>
          <CardContent className="p-4 md:p-6">
            <ImageUploader
              onImageSelect={handleImageSelect}
              isProcessing={isProcessing}
            >
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <OCRModeSelector
                    mode={ocrMode}
                    onModeChange={setOCRMode}
                    disabled={isProcessing}
                  />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-sm text-muted-foreground">Language:</span>
                  <LanguageSelector
                    value={language}
                    onChange={setLanguage}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </ImageUploader>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground italic">
          <Shield className="h-4 w-4" />
          <span>*Your privacy is protected! No data is transmitted or stored.</span>
        </div>

        <OCRResult
          text={result}
          isProcessing={isProcessing}
          progress={progress}
          progressStatus={progressStatus}
          onReset={handleReset}
        />

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <h3 className="font-semibold">Rate this tool</h3>
              <StarRating page="home" compact />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-4">
          <FeatureCard
            title="Multiple Formats"
            description="Supports JPG, PNG, GIF, JFIF, HEIC, PDF and more image formats."
          />
          <FeatureCard
            title="Multi-Language OCR"
            description="Extract text in English, Chinese, Japanese, Korean and 15+ languages."
          />
          <FeatureCard
            title="100% Privacy"
            description="All processing happens in your browser. No data is uploaded to servers."
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
      <CardContent className="p-4 sm:p-6">
        <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
