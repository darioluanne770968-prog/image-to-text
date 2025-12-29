"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Link as LinkIcon, ImageIcon, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isProcessing?: boolean;
  maxSize?: number;
  children?: React.ReactNode;
}

const ACCEPTED_FORMATS = {
  "image/jpeg": [".jpg", ".jpeg", ".jfif"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/heic": [".heic"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

export function ImageUploader({
  onImageSelect,
  isProcessing = false,
  maxSize = 10 * 1024 * 1024,
  children,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [urlDialogOpen, setUrlDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        handleFile(file);
      }
    },
    [onImageSelect]
  );

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/") || file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        if (file.type !== "application/pdf") {
          setPreview(reader.result as string);
        } else {
          setPreview("/pdf-icon.png");
        }
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxSize,
    multiple: false,
    disabled: isProcessing,
  });

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isProcessing) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            handleFile(file);
            break;
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [isProcessing, onImageSelect]);

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

      handleFile(file);
      setUrlDialogOpen(false);
      setImageUrl("");
    } catch {
      setUrlError("Failed to load image from URL. Please check the URL and try again.");
    } finally {
      setUrlLoading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-4 sm:p-6 md:p-8 text-center transition-all cursor-pointer min-h-[180px] sm:min-h-[220px] flex flex-col items-center justify-center touch-target",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-accent/50 active:bg-accent/70",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} ref={inputRef} />

        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 max-w-full rounded-lg mx-auto"
            />
            {!isProcessing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearPreview();
                }}
                className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full text-destructive-foreground hover:bg-destructive/90"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 flex flex-col items-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur"></div>
                <div className="relative bg-card p-3 sm:p-4 rounded-lg">
                  <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="text-center px-2">
              <h3 className="text-base sm:text-lg font-semibold">
                {isDragActive ? "Drop the image here" : "Drop, Upload or Paste Images"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                JPG, PNG, GIF, JFIF, HEIC, PDF
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                disabled={isProcessing}
                className="gap-2 h-10 sm:h-9 px-4 sm:px-3"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden xs:inline">Browse</span>
                <span className="xs:hidden">Upload</span>
              </Button>

              <Dialog open={urlDialogOpen} onOpenChange={setUrlDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isProcessing}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
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
                    {urlError && (
                      <p className="text-sm text-destructive">{urlError}</p>
                    )}
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

            {children && (
              <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                {children}
              </div>
            )}
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm font-medium">Processing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
