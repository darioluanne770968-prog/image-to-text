"use client";

import { cn } from "@/lib/utils";

export type OCRMode = "simple" | "formatted";

interface OCRModeSelectorProps {
  mode: OCRMode;
  onModeChange: (mode: OCRMode) => void;
  disabled?: boolean;
}

export function OCRModeSelector({
  mode,
  onModeChange,
  disabled = false,
}: OCRModeSelectorProps) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-card p-1">
      <button
        onClick={() => onModeChange("simple")}
        disabled={disabled}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all",
          mode === "simple"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-accent",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex flex-col items-start">
          <span>Simple OCR</span>
          <span className="text-xs opacity-70">Simple plain text</span>
        </div>
      </button>
      <button
        onClick={() => onModeChange("formatted")}
        disabled={disabled}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-all",
          mode === "formatted"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-accent",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex flex-col items-start">
          <span>Formatted Text</span>
          <span className="text-xs opacity-70">Table, list, headings etc.</span>
        </div>
      </button>
    </div>
  );
}
