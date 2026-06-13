"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TokenInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  presets: readonly { label: string; value: number }[];
  className?: string;
}

export function TokenInput({
  label,
  value,
  onChange,
  presets,
  className,
}: TokenInputProps) {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      const num = parseInt(raw, 10);
      if (raw === "") {
        onChange(0);
      } else if (!isNaN(num) && num >= 0 && num <= 1_000_000_000) {
        onChange(num);
      }
    },
    [onChange],
  );

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-foreground">{label}</label>

      <Input
        type="text"
        inputMode="numeric"
        value={value === 0 ? "" : value.toLocaleString()}
        onChange={handleInputChange}
        placeholder="0"
        className="h-10 font-mono text-sm"
      />

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <Button
            key={preset.value}
            variant={value === preset.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(preset.value)}
            className={cn(
              "h-7 text-xs font-mono",
              value === preset.value && "shadow-none",
            )}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
