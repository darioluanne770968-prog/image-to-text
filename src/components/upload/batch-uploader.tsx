"use client";

import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  ImageIcon,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  ChevronDown,
  Files,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface FileItem {
  id: string;
  file: File;
  preview: string | null;
  status: "pending" | "processing" | "completed" | "error";
  progress: number;
  result?: string;
  error?: string;
}

interface BatchUploaderProps {
  onProcess: (
    file: File,
    onProgress: (progress: number) => void
  ) => Promise<string>;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
}

const ACCEPTED_FORMATS = {
  "image/jpeg": [".jpg", ".jpeg", ".jfif"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/heic": [".heic"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

export function BatchUploader({
  onProcess,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024,
  disabled = false,
}: BatchUploaderProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: FileItem[] = acceptedFiles.slice(0, maxFiles - files.length).map((file) => {
        const id = Math.random().toString(36).substring(7);
        let preview: string | null = null;

        if (file.type.startsWith("image/")) {
          preview = URL.createObjectURL(file);
        }

        return {
          id,
          file,
          preview,
          status: "pending" as const,
          progress: 0,
        };
      });

      setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
    },
    [files.length, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxSize,
    multiple: true,
    disabled: disabled || isProcessing,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const processAllFiles = async () => {
    if (files.length === 0 || isProcessing) return;

    setIsProcessing(true);

    const pendingFiles = files.filter((f) => f.status !== "completed");
    const CONCURRENCY = 3; // Process 3 files in parallel

    // Process files in parallel with limited concurrency
    const processFile = async (fileItem: FileItem) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id ? { ...f, status: "processing" as const, progress: 0 } : f
        )
      );

      try {
        const result = await onProcess(fileItem.file, (progress) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id ? { ...f, progress: Math.round(progress * 100) } : f
            )
          );
        });

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: "completed" as const, progress: 100, result }
              : f
          )
        );
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? {
                  ...f,
                  status: "error" as const,
                  error: error instanceof Error ? error.message : "Processing failed",
                }
              : f
          )
        );
      }
    };

    // Process in batches of CONCURRENCY
    for (let i = 0; i < pendingFiles.length; i += CONCURRENCY) {
      const batch = pendingFiles.slice(i, i + CONCURRENCY);
      await Promise.all(batch.map(processFile));
    }

    setIsProcessing(false);
  };

  const downloadAllMerged = () => {
    const completedFiles = files.filter((f) => f.status === "completed" && f.result);
    if (completedFiles.length === 0) return;

    const combinedText = completedFiles
      .map((f) => `=== ${f.file.name} ===\n\n${f.result}\n`)
      .join("\n" + "=".repeat(50) + "\n\n");

    const blob = new Blob([combinedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "all-extracted-text.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("All results downloaded as one file!");
  };

  const downloadAllSeparate = () => {
    const completedFiles = files.filter((f) => f.status === "completed" && f.result);
    if (completedFiles.length === 0) return;

    completedFiles.forEach((f, index) => {
      setTimeout(() => {
        const blob = new Blob([f.result!], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = f.file.name.replace(/\.[^/.]+$/, "") + ".txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, index * 200);
    });
    toast.success(`Downloading ${completedFiles.length} files...`);
  };

  const clearAll = () => {
    files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
  };

  const completedCount = files.filter((f) => f.status === "completed").length;
  const hasResults = completedCount > 0;

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer min-h-[160px] flex flex-col items-center justify-center",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-accent/50",
          (disabled || isProcessing) && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} ref={inputRef} />

        <div className="space-y-4 flex flex-col items-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur"></div>
              <div className="relative bg-card p-3 rounded-lg">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold">
              {isDragActive
                ? "Drop files here"
                : `Batch Upload (max ${maxFiles} files)`}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Drop multiple images or click to select
            </p>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            disabled={disabled || isProcessing}
            variant="outline"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Files
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {files.length} file(s) selected • {completedCount} completed
            </span>
            <div className="flex gap-2">
              {hasResults && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={downloadAllSeparate}>
                      <Files className="h-4 w-4 mr-2" />
                      Download Separately
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={downloadAllMerged}>
                      <FileText className="h-4 w-4 mr-2" />
                      Download Merged
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                disabled={isProcessing}
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="flex items-center gap-3 p-3 bg-card rounded-lg border"
              >
                {fileItem.preview ? (
                  <img
                    src={fileItem.preview}
                    alt={fileItem.file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-muted rounded">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {fileItem.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(fileItem.file.size / 1024).toFixed(1)} KB
                  </p>
                  {fileItem.status === "processing" && (
                    <Progress value={fileItem.progress} className="h-1 mt-1" />
                  )}
                  {fileItem.status === "error" && (
                    <p className="text-xs text-destructive mt-1">
                      {fileItem.error}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {fileItem.status === "pending" && (
                    <span className="text-xs text-muted-foreground">Pending</span>
                  )}
                  {fileItem.status === "processing" && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {fileItem.status === "completed" && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {fileItem.status === "error" && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}

                  {!isProcessing && (
                    <button
                      onClick={() => removeFile(fileItem.id)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={processAllFiles}
            disabled={isProcessing || files.every((f) => f.status === "completed")}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Process All Files
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
