"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, type LanguageCode } from "@/lib/ocr/tesseract";

interface LanguageSelectorProps {
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
  disabled?: boolean;
}

export function LanguageSelector({
  value,
  onChange,
  disabled = false,
}: LanguageSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as LanguageCode)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
