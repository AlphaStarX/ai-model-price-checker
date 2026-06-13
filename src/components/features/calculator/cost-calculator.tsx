"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { TokenInput } from "./token-input";
import { ModelSelector } from "./model-selector";
import { CostBreakdown } from "./cost-breakdown";
import { CostChart } from "./cost-chart";
import { Separator } from "@/components/ui/separator";
import { TOKEN_PRESETS } from "@/lib/constants";
import type { CalculatorResult } from "@/types/model";
import { cn } from "@/lib/utils";

interface CostCalculatorProps {
  className?: string;
}

async function fetchPricing(
  modelSlug: string,
  inputTokens: number,
  outputTokens: number,
): Promise<CalculatorResult[]> {
  const res = await fetch(
    `/api/pricing?model=${modelSlug}&input=${inputTokens}&output=${outputTokens}`,
  );
  if (!res.ok) throw new Error("Failed to calculate pricing");
  const data = await res.json();
  return data.results ?? [];
}

export function CostCalculator({ className }: CostCalculatorProps) {
  const [modelSlug, setModelSlug] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(1000);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Debounced token values for API calls
  const [debouncedInput, setDebouncedInput] = useState(inputTokens);
  const [debouncedOutput, setDebouncedOutput] = useState(outputTokens);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedInput(inputTokens);
      setDebouncedOutput(outputTokens);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputTokens, outputTokens]);

  const handleModelSelect = useCallback(
    (slug: string, name: string) => {
      setModelSlug(slug);
      setModelName(name);
    },
    [],
  );

  const { data: results, isLoading, isError } = useQuery({
    queryKey: ["calculator", modelSlug, debouncedInput, debouncedOutput],
    queryFn: () => fetchPricing(modelSlug!, debouncedInput, debouncedOutput),
    enabled: modelSlug !== null && debouncedInput > 0 && debouncedOutput > 0,
    staleTime: 30_000,
    placeholderData: (prev) => prev, // keep previous results while loading
  });

  return (
    <div className={cn("space-y-8", className)}>
      {/* Model selector */}
      <div className="max-w-md">
        <label className="text-sm font-medium text-foreground mb-2 block">
          Model
        </label>
        <ModelSelector value={modelSlug} onChange={handleModelSelect} />
      </div>

      {/* Token inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TokenInput
          label="Input Tokens"
          value={inputTokens}
          onChange={setInputTokens}
          presets={TOKEN_PRESETS}
        />
        <TokenInput
          label="Output Tokens"
          value={outputTokens}
          onChange={setOutputTokens}
          presets={TOKEN_PRESETS}
        />
      </div>

      <Separator />

      {/* Results */}
      {!modelSlug && (
        <div className="rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground">
            Select a model above and enter token counts to see estimated costs
            across every provider.
          </p>
        </div>
      )}

      {modelSlug && isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-destructive font-medium">Failed to calculate costs</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please try again or select a different model.
          </p>
        </div>
      )}

      {modelSlug && (
        <CostBreakdown
          results={results ?? []}
          isLoading={isLoading}
          modelName={modelName ?? undefined}
          inputTokens={debouncedInput}
          outputTokens={debouncedOutput}
        />
      )}

      {modelSlug && results && results.length > 0 && !isLoading && (
        <CostChart results={results} />
      )}
    </div>
  );
}
