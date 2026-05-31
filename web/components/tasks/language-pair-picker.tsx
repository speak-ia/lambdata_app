"use client";

import { Label } from "@/components/ui/label";
import { getLanguageLabel } from "@/lib/languages";
import { cn } from "@/lib/utils";

const selectClass =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-base";

interface LanguagePairPickerProps {
  languages: string[];
  sourceLang: string;
  targetLang: string;
  onSourceChange: (code: string) => void;
  onTargetChange: (code: string) => void;
  className?: string;
}

export function LanguagePairPicker({
  languages,
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
  className,
}: LanguagePairPickerProps) {
  const handleSource = (code: string) => {
    onSourceChange(code);
    if (code === targetLang) {
      const next = languages.find((l) => l !== code);
      if (next) onTargetChange(next);
    }
  };

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="source-lang" className="text-xs text-muted-foreground">
          Langue source
        </Label>
        <select
          id="source-lang"
          className={selectClass}
          value={sourceLang}
          onChange={(e) => handleSource(e.target.value)}
        >
          {languages.map((code) => (
            <option key={code} value={code}>
              {getLanguageLabel(code)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="target-lang" className="text-xs text-muted-foreground">
          Traduire vers
        </Label>
        <select
          id="target-lang"
          className={selectClass}
          value={targetLang}
          onChange={(e) => onTargetChange(e.target.value)}
        >
          {languages
            .filter((code) => code !== sourceLang)
            .map((code) => (
              <option key={code} value={code}>
                {getLanguageLabel(code)}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
