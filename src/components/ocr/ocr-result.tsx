"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Copy, Download, Check, RotateCcw, FileText } from "lucide-react";
import { toast } from "sonner";

interface OCRResultProps {
  text: string;
  isProcessing: boolean;
  progress: number;
  progressStatus: string;
  onReset: () => void;
}

export function OCRResult({
  text,
  isProcessing,
  progress,
  progressStatus,
  onReset,
}: OCRResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Text copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy text");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  if (isProcessing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Processing...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground capitalize">
            {progressStatus || "Initializing..."}: {progress}%
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!text) {
    return null;
  }

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Extracted Text
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {wordCount} words, {charCount} characters
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <textarea
            value={text}
            readOnly
            className="w-full h-64 p-4 bg-muted/50 rounded-lg border border-border resize-none focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
