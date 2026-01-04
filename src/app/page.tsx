"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { OCRModeSelector, type OCRMode } from "@/components/ocr/ocr-mode-selector";
import { LanguageSelector } from "@/components/ocr/language-selector";
import {
  recognizeText,
  formatOCRResult,
  type LanguageCode,
  type OCRProgress,
} from "@/lib/ocr/tesseract";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StarRating } from "@/components/rating/star-rating";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  Upload,
  Link as LinkIcon,
  ImageIcon,
  X,
  Loader2,
  Copy,
  Download,
  Maximize2,
  Check,
  Trash2,
  RotateCcw,
  ChevronDown,
  FileText,
  Files,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: string;
  status: "pending" | "processing" | "done" | "error";
  progress: number;
  result?: string;
  error?: string;
}

const ACCEPTED_FORMATS = {
  "image/jpeg": [".jpg", ".jpeg", ".jfif"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/heic": [".heic"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function Home() {
  const [ocrMode, setOCRMode] = useState<OCRMode>("simple");
  const [language, setLanguage] = useState<LanguageCode>("auto");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlDialogOpen, setUrlDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addImages = useCallback((files: File[]) => {
    const newImages: ImageFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : "/pdf-icon.png",
      name: file.name,
      size: formatFileSize(file.size),
      status: "pending",
      progress: 0,
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        addImages(acceptedFiles);
      }
    },
    [addImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxSize: 10 * 1024 * 1024,
    multiple: true,
    disabled: isProcessing,
  });

  const handleUrlSubmit = async () => {
    if (!imageUrl.trim()) return;
    setUrlLoading(true);
    setUrlError("");
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");
      const blob = await response.blob();
      const fileName = imageUrl.split("/").pop() || "image.jpg";
      const file = new File([blob], fileName, { type: blob.type });
      addImages([file]);
      setUrlDialogOpen(false);
      setImageUrl("");
    } catch {
      setUrlError("Failed to load image from URL.");
    } finally {
      setUrlLoading(false);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img?.preview && img.preview.startsWith("blob:")) {
        URL.revokeObjectURL(img.preview);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach((img) => {
      if (img.preview.startsWith("blob:")) {
        URL.revokeObjectURL(img.preview);
      }
    });
    setImages([]);
  };

  const processImages = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);

    const pendingImages = images.filter((img) => img.status !== "done");
    const CONCURRENCY = 3; // Process 3 images in parallel

    const processImage = async (img: ImageFile) => {
      setImages((prev) =>
        prev.map((item) =>
          item.id === img.id ? { ...item, status: "processing", progress: 0 } : item
        )
      );

      try {
        const ocrResult = await recognizeText(
          img.file,
          language,
          (p: OCRProgress) => {
            setImages((prev) =>
              prev.map((item) =>
                item.id === img.id ? { ...item, progress: p.progress } : item
              )
            );
          }
        );

        const formattedText = formatOCRResult(ocrResult, ocrMode === "formatted");

        setImages((prev) =>
          prev.map((item) =>
            item.id === img.id
              ? { ...item, status: "done", progress: 100, result: formattedText }
              : item
          )
        );
      } catch (error) {
        console.error("OCR Error:", error);
        setImages((prev) =>
          prev.map((item) =>
            item.id === img.id
              ? { ...item, status: "error", error: "Failed to process" }
              : item
          )
        );
      }
    };

    // Process in batches of CONCURRENCY
    for (let i = 0; i < pendingImages.length; i += CONCURRENCY) {
      const batch = pendingImages.slice(i, i + CONCURRENCY);
      await Promise.all(batch.map(processImage));
    }

    setIsProcessing(false);
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = (name: string, text: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name.replace(/\.[^/.]+$/, "") + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const hasResults = images.some((img) => img.status === "done");
  const hasPending = images.some((img) => img.status === "pending" || img.status === "error");
  const completedImages = images.filter((img) => img.status === "done" && img.result);

  const handleDownloadAllMerged = () => {
    if (completedImages.length === 0) return;

    // Combine all results into one file
    const allContent = completedImages
      .map((img) => {
        return `=== ${img.name} ===\n\n${img.result}\n`;
      })
      .join("\n" + "=".repeat(50) + "\n\n");

    const blob = new Blob([allContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all-extracted-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("All results downloaded as one file!");
  };

  const handleDownloadAllSeparate = () => {
    if (completedImages.length === 0) return;

    // Download each result as a separate file
    completedImages.forEach((img, index) => {
      setTimeout(() => {
        const blob = new Blob([img.result!], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = img.name.replace(/\.[^/.]+$/, "") + ".txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, index * 200); // Stagger downloads to avoid browser blocking
    });
    toast.success(`Downloading ${completedImages.length} files...`);
  };

  const handleStartOver = () => {
    clearAll();
  };

  return (
    <div className="container py-6">
      <div className="max-w-5xl mx-auto space-y-6">
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
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Left: Drop Zone */}
              <div className="flex-1">
                <div
                  {...getRootProps()}
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer min-h-[280px] flex flex-col items-center justify-center",
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-accent/50",
                    isProcessing && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <input {...getInputProps()} ref={inputRef} />

                  <div className="space-y-4 flex flex-col items-center">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur"></div>
                      <div className="relative bg-card p-4 rounded-lg">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg font-semibold">
                        {isDragActive ? "Drop images here" : "Drop, Upload or Paste Images"}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Supported formats: JPG, PNG, GIF, JFIF, HEIC, PDF
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          inputRef.current?.click();
                        }}
                        disabled={isProcessing}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Browse
                      </Button>

                      <Dialog open={urlDialogOpen} onOpenChange={setUrlDialogOpen}>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isProcessing}
                          onClick={(e) => {
                            e.stopPropagation();
                            setUrlDialogOpen(true);
                          }}
                        >
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                        <DialogContent onClick={(e) => e.stopPropagation()}>
                          <DialogHeader>
                            <DialogTitle>Load Image from URL</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <Input
                              placeholder="Enter image URL..."
                              value={imageUrl}
                              onChange={(e) => setImageUrl(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                            />
                            {urlError && <p className="text-sm text-destructive">{urlError}</p>}
                            <Button
                              onClick={handleUrlSubmit}
                              disabled={urlLoading || !imageUrl.trim()}
                              className="w-full"
                            >
                              {urlLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Loading...
                                </>
                              ) : (
                                "Load Image"
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-3 pt-2" onClick={(e) => e.stopPropagation()}>
                      <OCRModeSelector
                        mode={ocrMode}
                        onModeChange={setOCRMode}
                        disabled={isProcessing}
                      />
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-sm text-muted-foreground">Language:</span>
                        <LanguageSelector
                          value={language}
                          onChange={setLanguage}
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Image Queue */}
              {images.length > 0 && (
                <div className="lg:w-80 space-y-3">
                  <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1">
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg group"
                      >
                        <img
                          src={img.preview}
                          alt={img.name}
                          className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => setPreviewImage(img.preview)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{img.name}</p>
                          <p className="text-xs text-muted-foreground">{img.size}</p>
                          {img.status === "processing" && (
                            <Progress value={img.progress} className="h-1 mt-1" />
                          )}
                          {img.status === "done" && (
                            <span className="text-xs text-green-500">Done</span>
                          )}
                          {img.status === "error" && (
                            <span className="text-xs text-destructive">{img.error}</span>
                          )}
                        </div>
                        {!isProcessing && (
                          <button
                            onClick={() => removeImage(img.id)}
                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded transition-opacity"
                          >
                            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={clearAll}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                    <Button
                      onClick={processImages}
                      disabled={isProcessing || !hasPending}
                      className="flex-1"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Convert"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground italic">
          <Shield className="h-4 w-4" />
          <span>*Your privacy is protected! No data is transmitted or stored.</span>
        </div>

        {/* Results Section */}
        {hasResults && (
          <div className="space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Result ({completedImages.length})
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartOver}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDownloadAllSeparate}>
                      <Files className="h-4 w-4 mr-2" />
                      Download Separately
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadAllMerged}>
                      <FileText className="h-4 w-4 mr-2" />
                      Download Merged
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {images
              .filter((img) => img.status === "done" && img.result)
              .map((img) => (
                <Card key={img.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={img.preview}
                          alt={img.name}
                          className="w-10 h-10 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => setPreviewImage(img.preview)}
                        />
                        <span className="font-medium text-sm truncate max-w-[200px]">
                          {img.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(img.id, img.result!)}
                        >
                          {copiedId === img.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(img.name, img.result!)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPreviewImage(img.preview)}
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 max-h-48 overflow-y-auto">
                      <p className="text-sm whitespace-pre-wrap">{img.result}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

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
            title="Multiple Images"
            description="Upload and process multiple images at once with batch conversion."
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

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-2 sm:p-4">
          <DialogHeader className="sr-only">
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="flex items-center justify-center overflow-auto">
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
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
