"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Upload,
  Loader2,
  Copy,
  Download,
  Check,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import * as pdfjsLib from "pdfjs-dist";

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setExtractedText("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
    disabled: isProcessing,
  });

  const extractText = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setExtractedText("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      let fullText = "";

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
        setProgress(Math.round((i / totalPages) * 100));
      }

      setExtractedText(fullText.trim());
      toast.success(`Extracted text from ${totalPages} pages!`);
    } catch (error) {
      console.error("PDF extraction error:", error);
      toast.error("Failed to extract text from PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name.replace(/\.pdf$/i, "") + ".txt" || "extracted.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const clearAll = () => {
    setFile(null);
    setExtractedText("");
    setProgress(0);
  };

  return (
    <div className="container py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            PDF to Text Converter
          </h1>
          <p className="text-muted-foreground">
            Extract text content from PDF files instantly
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
                isProcessing && "opacity-50 cursor-not-allowed"
              )}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {isDragActive ? "Drop PDF here" : "Upload PDF File"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drag & drop or click to select (Max 50MB)
                  </p>
                </div>
                <Button disabled={isProcessing}>
                  <Upload className="h-4 w-4 mr-2" />
                  Select PDF
                </Button>
              </div>
            </div>

            {file && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearAll}
                    disabled={isProcessing}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-center text-muted-foreground">
                      Extracting text... {progress}%
                    </p>
                  </div>
                )}

                <Button
                  onClick={extractText}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Extract Text"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {extractedText && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Extracted Text</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download TXT
                  </Button>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {extractedText}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
