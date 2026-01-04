"use client";

import { useState, useCallback } from "react";
import { ImageUploader } from "@/components/upload/image-uploader";
import { LanguageSelector } from "@/components/ocr/language-selector";
import {
  recognizeText,
  type LanguageCode,
  type OCRProgress,
} from "@/lib/ocr/tesseract";
import { createExcelDocument, downloadBlob } from "@/lib/convert/to-excel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  FileSpreadsheet,
  Download,
  RotateCcw,
  Check,
  Copy,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function PdfToExcelPage() {
  const [language, setLanguage] = useState<LanguageCode>("auto");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const handleImageSelect = useCallback(
    async (file: File) => {
      if (file.type === "application/pdf") {
        toast.info(
          "PDF files are processed page by page. For best results, upload images of individual pages."
        );
      }

      setIsProcessing(true);
      setProgress(0);
      setProgressStatus("Processing file...");
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
        toast.error("Failed to process file. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    },
    [language]
  );

  const handleDownloadExcel = async () => {
    if (!result) return;

    try {
      const blob = await createExcelDocument(result, {
        sheetName: "PDF Data",
        parseTable: true,
      });
      downloadBlob(blob, "pdf-data.xlsx");
      toast.success("Excel file downloaded!");
    } catch (error) {
      console.error("Error creating Excel:", error);
      toast.error("Failed to create Excel file");
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
            PDF to Excel Converter
          </h1>
          <p className="text-muted-foreground text-lg">
            Extract tables from PDF documents and convert to Excel spreadsheets.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <span className="text-sm">
            For best results with PDFs, upload screenshots or images of individual pages.
          </span>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8 space-y-6">
            <ImageUploader
              onImageSelect={handleImageSelect}
              isProcessing={isProcessing}
            />

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
                <FileSpreadsheet className="h-5 w-5" />
                Extracted Data
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  Copy
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownloadExcel}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel
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
            title="PDF Table Extraction"
            description="Extract tabular data from PDF documents and convert to Excel format."
          />
          <FeatureCard
            title="OCR Technology"
            description="Uses advanced OCR to recognize text even from scanned PDFs."
          />
          <FeatureCard
            title="Preserve Structure"
            description="Maintains the original table structure in the output Excel file."
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
