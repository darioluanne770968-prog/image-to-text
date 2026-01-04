"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, ImageIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const FONTS = [
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Courier New, monospace", label: "Courier New" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Comic Sans MS, cursive", label: "Comic Sans" },
];

const COLORS = [
  { value: "#000000", label: "Black" },
  { value: "#ffffff", label: "White" },
  { value: "#ef4444", label: "Red" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#22c55e", label: "Green" },
  { value: "#f59e0b", label: "Orange" },
  { value: "#8b5cf6", label: "Purple" },
];

const BG_COLORS = [
  { value: "#ffffff", label: "White" },
  { value: "#000000", label: "Black" },
  { value: "#f3f4f6", label: "Light Gray" },
  { value: "#1f2937", label: "Dark Gray" },
  { value: "#fef3c7", label: "Cream" },
  { value: "#dbeafe", label: "Light Blue" },
  { value: "#dcfce7", label: "Light Green" },
  { value: "transparent", label: "Transparent" },
];

export default function TextToImagePage() {
  const [text, setText] = useState("Hello World!");
  const [fontSize, setFontSize] = useState("48");
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [padding, setPadding] = useState("40");
  const [width, setWidth] = useState("800");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas || !text.trim()) return;

    const ctx = canvas.getContext("2d")!;
    const lines = text.split("\n");
    const size = parseInt(fontSize);
    const pad = parseInt(padding);
    const maxWidth = parseInt(width);

    ctx.font = `${size}px ${fontFamily}`;

    // Calculate dimensions
    let textWidth = 0;
    lines.forEach((line) => {
      const metrics = ctx.measureText(line);
      textWidth = Math.max(textWidth, metrics.width);
    });

    const lineHeight = size * 1.4;
    const textHeight = lines.length * lineHeight;

    canvas.width = Math.min(Math.max(textWidth + pad * 2, 200), maxWidth);
    canvas.height = textHeight + pad * 2;

    // Draw background
    if (bgColor === "transparent") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw text
    ctx.font = `${size}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.textBaseline = "top";

    lines.forEach((line, index) => {
      ctx.fillText(line, pad, pad + index * lineHeight);
    });

    // Update preview
    setPreviewUrl(canvas.toDataURL("image/png"));
  };

  useEffect(() => {
    generateImage();
  }, [text, fontSize, fontFamily, textColor, bgColor, padding, width]);

  const downloadImage = (format: "png" | "jpg") => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let dataUrl: string;
    let filename: string;

    if (format === "jpg") {
      // Create a new canvas with white background for JPG
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d")!;

      tempCtx.fillStyle = bgColor === "transparent" ? "#ffffff" : bgColor;
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canvas, 0, 0);

      dataUrl = tempCanvas.toDataURL("image/jpeg", 0.95);
      filename = "text-image.jpg";
    } else {
      dataUrl = canvas.toDataURL("image/png");
      filename = "text-image.png";
    }

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.success(`Downloaded as ${format.toUpperCase()}!`);
  };

  return (
    <div className="container py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Text to Image Converter
          </h1>
          <p className="text-muted-foreground">
            Convert your text into a downloadable image
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Text Content</Label>
                <Textarea
                  id="text"
                  placeholder="Enter your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24px</SelectItem>
                      <SelectItem value="32">32px</SelectItem>
                      <SelectItem value="48">48px</SelectItem>
                      <SelectItem value="64">64px</SelectItem>
                      <SelectItem value="72">72px</SelectItem>
                      <SelectItem value="96">96px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONTS.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <Select value={textColor} onValueChange={setTextColor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: color.value }}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Background</Label>
                  <Select value={bgColor} onValueChange={setBgColor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BG_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{
                                backgroundColor:
                                  color.value === "transparent"
                                    ? "transparent"
                                    : color.value,
                                backgroundImage:
                                  color.value === "transparent"
                                    ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                                    : undefined,
                                backgroundSize: "8px 8px",
                                backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                              }}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Padding (px)</Label>
                  <Input
                    type="number"
                    value={padding}
                    onChange={(e) => setPadding(e.target.value)}
                    min="0"
                    max="200"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Width (px)</Label>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    min="200"
                    max="2000"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => downloadImage("png")} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                <Button
                  onClick={() => downloadImage("jpg")}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download JPG
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Preview
                </h2>
                <Button variant="ghost" size="sm" onClick={generateImage}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div
                className="border rounded-lg p-4 min-h-[300px] flex items-center justify-center overflow-auto"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto"
                  />
                ) : (
                  <p className="text-muted-foreground">Enter text to preview</p>
                )}
              </div>

              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
