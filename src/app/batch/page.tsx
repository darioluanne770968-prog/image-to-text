"use client";

import { useState, useCallback } from "react";
import { BatchUploader } from "@/components/upload/batch-uploader";
import { OCRModeSelector, type OCRMode } from "@/components/ocr/ocr-mode-selector";
import { LanguageSelector } from "@/components/ocr/language-selector";
import {
  recognizeText,
  formatOCRResult,
  type LanguageCode,
} from "@/lib/ocr/tesseract";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Layers } from "lucide-react";

export default function BatchPage() {
  const [ocrMode, setOCRMode] = useState<OCRMode>("simple");
  const [language, setLanguage] = useState<LanguageCode>("auto");

  const handleProcess = useCallback(
    async (file: File, onProgress: (progress: number) => void): Promise<string> => {
      const ocrResult = await recognizeText(file, language, (p) => {
        onProgress(p.progress);
      });

      return formatOCRResult(ocrResult, ocrMode === "formatted");
    },
    [language, ocrMode]
  );

  return (
    <div className="container py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Layers className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Batch Image to Text
            </h1>
          </div>
          <p className="text-muted-foreground">
            Upload multiple images and extract text from all of them at once.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">OCR Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <OCRModeSelector
                mode={ocrMode}
                onModeChange={setOCRMode}
                disabled={false}
              />
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground">Language:</span>
              <LanguageSelector
                value={language}
                onChange={setLanguage}
                disabled={false}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <BatchUploader
              onProcess={handleProcess}
              maxFiles={10}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground italic">
          <Shield className="h-4 w-4" />
          <span>*Your privacy is protected! No data is transmitted or stored.</span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          <FeatureCard
            title="Batch Processing"
            description="Upload up to 10 images and process them all at once with a single click."
          />
          <FeatureCard
            title="Progress Tracking"
            description="See real-time progress for each file being processed."
          />
          <FeatureCard
            title="Download All"
            description="Download all extracted text as a single combined file."
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
