"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ModelOption {
  slug: string;
  name: string;
  developer: string;
  modelFamily: string | null;
}

interface ModelSelectorProps {
  value: string | null;
  onChange: (slug: string, name: string) => void;
  className?: string;
}

export function ModelSelector({
  value,
  onChange,
  className,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [models, setModels] = useState<ModelOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  // Fetch models: all when empty, filtered when searching
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const url = query.length < 1
          ? "/api/search"  // returns all 36 models
          : `/api/search?q=${encodeURIComponent(query)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setModels(
            data.results
              ?.filter((r: { type: string }) => r.type === "model")
              ?.map((r: { slug: string; name: string; subtitle: string }) => ({
                slug: r.slug,
                name: r.name,
                developer: r.subtitle.split(" · ")[0] ?? "",
                modelFamily: r.subtitle.split(" · ")[1] ?? null,
              })) ?? [],
          );
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }, query.length < 1 ? 0 : 200);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback(
    (model: ModelOption) => {
      onChange(model.slug, model.name);
      setSelectedName(model.name);
      setOpen(false);
      setQuery("");
    },
    [onChange],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between h-10", className)}
          >
            {selectedName ?? "Select a model..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        }
      />
      <PopoverContent className="w-[--popover-anchor-width] p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Search models..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent h-10 px-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {isLoading && (
            <div className="p-2 space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>
          )}
          {!isLoading && models.length === 0 && query && (
            <p className="p-4 text-sm text-center text-muted-foreground">
              No models found.
            </p>
          )}
          {!isLoading &&
            models.map((model) => (
              <button
                key={model.slug}
                onClick={() => handleSelect(model)}
                className={cn(
                  "flex w-full items-center justify-between rounded-sm px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                  value === model.slug && "bg-accent",
                )}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {model.developer}
                    {model.modelFamily ? ` · ${model.modelFamily}` : ""}
                  </span>
                </div>
                {value === model.slug && (
                  <Check className="h-4 w-4 text-primary shrink-0" />
                )}
              </button>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
