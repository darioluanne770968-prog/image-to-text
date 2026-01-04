"use client";

import { useState, useCallback } from "react";
import { ImageUploader } from "@/components/upload/image-uploader";
import { LanguageSelector } from "@/components/ocr/language-selector";
import {
  recognizeText,
  type LanguageCode,
  type OCRProgress,
} from "@/lib/ocr/tesseract";
import {
  translateText,
  TRANSLATE_LANGUAGES,
  type TranslateLanguage,
} from "@/lib/translate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  ArrowRight,
  Copy,
  Download,
  Check,
  RotateCcw,
  Languages,
} from "lucide-react";
import { toast } from "sonner";

export default function ImageTranslatorPage() {
  const [sourceLanguage, setSourceLanguage] = useState<LanguageCode>("auto");
  const [targetLanguage, setTargetLanguage] = useState<TranslateLanguage>("zh");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [copied, setCopied] = useState(false);

  const ocrToTranslateLang = (ocr: LanguageCode): TranslateLanguage => {
    const mapping: Partial<Record<LanguageCode, TranslateLanguage>> = {
      auto: "en",
      eng: "en",
      chi_sim: "zh",
      chi_tra: "zh",
      jpn: "ja",
      kor: "ko",
      spa: "es",
      fra: "fr",
      deu: "de",
      rus: "ru",
      ara: "ar",
      hin: "en",
      por: "pt",
      ita: "it",
      vie: "vi",
      tha: "th",
    };
    return mapping[ocr] || "en";
  };

  const handleImageSelect = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setProgress(0);
      setProgressStatus("Recognizing text...");
      setOriginalText("");
      setTranslatedText("");

      try {
        const ocrResult = await recognizeText(
          file,
          sourceLanguage,
          (p: OCRProgress) => {
            setProgress(Math.round(p.progress * 0.6));
            setProgressStatus(p.status);
          }
        );

        setOriginalText(ocrResult.text.trim());
        setProgressStatus("Translating...");
        setProgress(70);

        const fromLang = ocrToTranslateLang(sourceLanguage);
        const translated = await translateText(
          ocrResult.text.trim(),
          fromLang,
          targetLanguage
        );

        setTranslatedText(translated);
        setProgress(100);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to process image. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    },
    [sourceLanguage, targetLanguage]
  );

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = () => {
    const content = `Original Text:\n${originalText}\n\n---\n\nTranslated Text:\n${translatedText}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "translated-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const handleReset = () => {
    setOriginalText("");
    setTranslatedText("");
    setProgress(0);
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Image Translator
          </h1>
          <p className="text-muted-foreground text-lg">
            Extract text from images and translate to any language.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8 space-y-6">
            <ImageUploader
              onImageSelect={handleImageSelect}
              isProcessing={isProcessing}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">From:</span>
                <LanguageSelector
                  value={sourceLanguage}
                  onChange={setSourceLanguage}
                  disabled={isProcessing}
                />
              </div>

              <ArrowRight className="h-5 w-5 text-muted-foreground hidden sm:block" />

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">To:</span>
                <Select
                  value={targetLanguage}
                  onValueChange={(v) => setTargetLanguage(v as TranslateLanguage)}
                  disabled={isProcessing}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSLATE_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

        {(originalText || translatedText) && !isProcessing && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Translation Result
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(translatedText)}
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Original Text
                  </label>
                  <textarea
                    value={originalText}
                    readOnly
                    className="w-full h-48 p-4 bg-muted/50 rounded-lg border resize-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Translated Text
                  </label>
                  <textarea
                    value={translatedText}
                    readOnly
                    className="w-full h-48 p-4 bg-muted/50 rounded-lg border resize-none text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>*Your privacy is protected! No data is transmitted or stored.</span>
        </div>
      </div>
    </div>
  );
}
