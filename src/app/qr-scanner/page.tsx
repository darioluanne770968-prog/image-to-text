"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  QrCode,
  Upload,
  Copy,
  Check,
  ExternalLink,
  ImageIcon,
  Shield,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Simple QR code detection using canvas and jsQR
async function decodeQRCode(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Try to use jsQR if available (loaded dynamically)
      import("jsqr")
        .then((jsQR) => {
          const code = jsQR.default(
            imageData.data,
            imageData.width,
            imageData.height
          );
          resolve(code?.data || null);
        })
        .catch(() => {
          resolve(null);
        });
    };
    img.onerror = () => resolve(null);
    img.src = URL.createObjectURL(file);
  });
}

export default function QRScannerPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setResult(null);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      const decoded = await decodeQRCode(file);
      if (decoded) {
        setResult(decoded);
        toast.success("QR code decoded successfully!");
      } else {
        toast.error("No QR code found in the image");
      }
    } catch (error) {
      console.error("Error decoding QR code:", error);
      toast.error("Failed to decode QR code");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFile(acceptedFiles[0]);
      }
    },
    [handleFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const isUrl = result?.startsWith("http://") || result?.startsWith("https://");

  const handleReset = () => {
    setResult(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <div className="container py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <QrCode className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              QR Code Scanner
            </h1>
          </div>
          <p className="text-muted-foreground">
            Upload an image to decode QR codes instantly
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={cn(
                "relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer min-h-[200px] flex flex-col items-center justify-center",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-accent/50",
                isProcessing && "opacity-50 cursor-not-allowed"
              )}
            >
              <input {...getInputProps()} ref={inputRef} />

              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Uploaded QR code"
                    className="max-h-48 max-w-full mx-auto rounded-lg"
                  />
                  {isProcessing && (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Scanning...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur"></div>
                    <div className="relative bg-card p-4 rounded-lg">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {isDragActive ? "Drop QR code image here" : "Upload QR Code Image"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Drop an image or click to select
                    </p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
                    disabled={isProcessing}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Image
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground italic">
          <Shield className="h-4 w-4" />
          <span>*Your privacy is protected! Processing happens in your browser.</span>
        </div>

        {result && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Decoded Content
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
                  {isUrl && (
                    <Button size="sm" asChild>
                      <a href={result} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Link
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Scan Another
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm break-all">
                  {isUrl ? (
                    <a
                      href={result}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {result}
                    </a>
                  ) : (
                    result
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6 pt-4">
          <FeatureCard
            title="Instant Decode"
            description="Scan QR codes instantly without any server processing."
          />
          <FeatureCard
            title="Multiple Formats"
            description="Supports URLs, text, contact cards, WiFi credentials, and more."
          />
          <FeatureCard
            title="Privacy First"
            description="All processing happens in your browser. Your images stay private."
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
