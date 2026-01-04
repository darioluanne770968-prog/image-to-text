"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Upload,
  Download,
  Loader2,
  Trash2,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ConvertedImage {
  page: number;
  dataUrl: string;
}

export default function PDFToJPGPage() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState("0.9");
  const [scale, setScale] = useState("2");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setImages([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
    disabled: isProcessing,
  });

  const convertToImages = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setImages([]);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const convertedImages: ConvertedImage[] = [];
      const scaleValue = parseFloat(scale);
      const qualityValue = parseFloat(quality);

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: scaleValue });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise;

        const dataUrl = canvas.toDataURL("image/jpeg", qualityValue);
        convertedImages.push({ page: i, dataUrl });

        setProgress(Math.round((i / totalPages) * 100));
      }

      setImages(convertedImages);
      toast.success(`Converted ${totalPages} pages to images!`);
    } catch (error) {
      console.error("PDF conversion error:", error);
      toast.error("Failed to convert PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (img: ConvertedImage) => {
    const a = document.createElement("a");
    a.href = img.dataUrl;
    a.download = `${file?.name.replace(/\.pdf$/i, "")}_page_${img.page}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    images.forEach((img, index) => {
      setTimeout(() => downloadImage(img), index * 200);
    });
    toast.success(`Downloading ${images.length} images...`);
  };

  const clearAll = () => {
    setFile(null);
    setImages([]);
    setProgress(0);
  };

  return (
    <div className="container py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            PDF to JPG Converter
          </h1>
          <p className="text-muted-foreground">
            Convert PDF pages to high-quality JPG images
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
                    Max 50MB
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Image Quality</Label>
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.6">Low (60%)</SelectItem>
                        <SelectItem value="0.8">Medium (80%)</SelectItem>
                        <SelectItem value="0.9">High (90%)</SelectItem>
                        <SelectItem value="1">Maximum (100%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Resolution Scale</Label>
                    <Select value={scale} onValueChange={setScale}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1x (72 DPI)</SelectItem>
                        <SelectItem value="1.5">1.5x (108 DPI)</SelectItem>
                        <SelectItem value="2">2x (144 DPI)</SelectItem>
                        <SelectItem value="3">3x (216 DPI)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-center text-muted-foreground">
                      Converting... {progress}%
                    </p>
                  </div>
                )}

                <Button
                  onClick={convertToImages}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Convert to JPG
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {images.length > 0 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">
                  Converted Images ({images.length})
                </h2>
                <Button onClick={downloadAll} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img) => (
                  <div
                    key={img.page}
                    className="relative group aspect-[3/4] bg-muted rounded-lg overflow-hidden border"
                  >
                    <img
                      src={img.dataUrl}
                      alt={`Page ${img.page}`}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="sm"
                        onClick={() => downloadImage(img)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                      Page {img.page}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
