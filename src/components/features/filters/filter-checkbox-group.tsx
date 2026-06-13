"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface FilterCheckboxGroupProps {
  title: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function FilterCheckboxGroup({
  title,
  options,
  selected,
  onChange,
  className,
}: FilterCheckboxGroupProps) {
  if (options.length === 0) return null;

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <fieldset className={cn("space-y-2", className)}>
      <legend className="text-xs font-semibold text-foreground uppercase tracking-wider">
        {title}
      </legend>
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
              "hover:bg-accent/50",
              selected.includes(option.value) && "bg-accent/30",
            )}
          >
            <Checkbox
              checked={selected.includes(option.value)}
              onCheckedChange={() => toggle(option.value)}
              className="h-3.5 w-3.5"
            />
            <Label className="flex-1 text-sm cursor-pointer font-normal">
              {option.label}
            </Label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {option.count}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
