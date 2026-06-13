"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { ModelSelector } from "@/components/features/calculator/model-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPricePerMillion } from "@/lib/pricing-calc";
import { cn } from "@/lib/utils";
import type { ModelDetail } from "@/types/model";

interface SelectedModel {
  slug: string;
  name: string;
}

async function fetchModel(slug: string): Promise<ModelDetail> {
  const res = await fetch(`/api/models/${slug}`);
  if (!res.ok) throw new Error(`Failed to fetch model: ${slug}`);
  return res.json();
}

export default function ComparePage() {
  const [selectedModels, setSelectedModels] = useState<SelectedModel[]>([]);

  const addModel = useCallback(
    (slug: string, name: string) => {
      if (selectedModels.length >= 4) return;
      if (selectedModels.some((m) => m.slug === slug)) return;
      setSelectedModels((prev) => [...prev, { slug, name }]);
    },
    [selectedModels],
  );

  const removeModel = useCallback((slug: string) => {
    setSelectedModels((prev) => prev.filter((m) => m.slug !== slug));
  }, []);

  // Fetch details for all selected models
  const modelSlugs = selectedModels.map((m) => m.slug);
  const queryKey = ["compare", modelSlugs.sort().join(",")];

  const {
    data: models,
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const results = await Promise.all(
        selectedModels.map((m) => fetchModel(m.slug)),
      );
      return results;
    },
    enabled: selectedModels.length >= 2,
    staleTime: 60_000,
  });

  // Build comparison matrix: model × provider
  const allProviders = new Set<string>();
  const pricingMatrix: Record<string, Record<string, {
    inputPricePerMillion: number;
    outputPricePerMillion: number;
    cachedInputPricePerMillion: number | null;
  }>> = {};

  if (models) {
    for (const model of models) {
      pricingMatrix[model.slug] = {};
      for (const p of model.pricing) {
        allProviders.add(p.provider.name);
        pricingMatrix[model.slug][p.provider.name] = {
          inputPricePerMillion: p.inputPricePerMillion,
          outputPricePerMillion: p.outputPricePerMillion,
          cachedInputPricePerMillion: p.cachedInputPricePerMillion,
        };
      }
    }
  }

  const providerList = Array.from(allProviders);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Compare Models
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select 2–4 models to compare pricing side-by-side across providers.
        </p>
      </div>

      {/* Model selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {selectedModels.map((model) => (
          <div
            key={model.slug}
            className="relative flex items-center gap-2 rounded-lg border border-border bg-card p-3"
          >
            <span className="text-sm font-medium truncate flex-1">
              {model.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => removeModel(model.slug)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}

        {selectedModels.length < 4 && (
          <ModelSelector
            value={null}
            onChange={addModel}
            className="h-full min-h-[52px]"
          />
        )}

        {selectedModels.length < 4 && selectedModels.length > 0 && (
          <div className="flex items-center justify-center text-sm text-muted-foreground lg:hidden">
            Add up to {4 - selectedModels.length} more model
            {4 - selectedModels.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Empty state */}
      {selectedModels.length < 2 && (
        <div className="rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground">
            Select at least 2 models above to compare pricing side-by-side.
          </p>
        </div>
      )}

      {/* Loading */}
      {isLoading && selectedModels.length >= 2 && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-destructive font-medium">Failed to load models</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please try again or select different models.
          </p>
        </div>
      )}

      {/* Comparison table */}
      {models && models.length >= 2 && !isLoading && (
        <div className="rounded-lg border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[180px] sticky left-0 bg-muted/50">
                  Provider
                </TableHead>
                {models.map((model, i) => (
                  <TableHead
                    key={model.slug}
                    className={cn(
                      "text-center min-w-[180px]",
                      i === 0 && "border-l",
                    )}
                  >
                    <span className="font-semibold">{model.name}</span>
                    <span className="block text-xs text-muted-foreground font-normal mt-0.5">
                      {model.developer.name}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Specs row */}
              <TableRow className="bg-muted/20">
                <TableCell className="font-medium text-xs uppercase text-muted-foreground sticky left-0 bg-muted/20">
                  Context Window
                </TableCell>
                {models.map((model, i) => (
                  <TableCell
                    key={model.slug}
                    className={cn(
                      "text-center font-mono text-sm",
                      i === 0 && "border-l",
                    )}
                  >
                    {model.contextWindow
                      ? model.contextWindow >= 1_000_000
                        ? `${model.contextWindow / 1_000_000}M`
                        : `${(model.contextWindow / 1_000).toFixed(0)}K`
                      : "—"}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className="bg-muted/20">
                <TableCell className="font-medium text-xs uppercase text-muted-foreground sticky left-0 bg-muted/20">
                  Max Output
                </TableCell>
                {models.map((model, i) => (
                  <TableCell
                    key={model.slug}
                    className={cn(
                      "text-center font-mono text-sm",
                      i === 0 && "border-l",
                    )}
                  >
                    {model.maxOutputTokens
                      ? model.maxOutputTokens.toLocaleString()
                      : "—"}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow className="bg-muted/20">
                <TableCell className="font-medium text-xs uppercase text-muted-foreground sticky left-0 bg-muted/20">
                  Capabilities
                </TableCell>
                {models.map((model, i) => (
                  <TableCell
                    key={model.slug}
                    className={cn(
                      "text-center",
                      i === 0 && "border-l",
                    )}
                  >
                    <div className="flex flex-wrap justify-center gap-1">
                      {model.capabilities.slice(0, 4).map((c) => (
                        <Badge
                          key={c.slug}
                          variant="outline"
                          className="text-[10px] py-0 px-1"
                        >
                          {c.label}
                        </Badge>
                      ))}
                      {model.capabilities.length > 4 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 px-1"
                        >
                          +{model.capabilities.length - 4}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* Pricing rows per provider */}
              {providerList.map((providerName) => (
                <TableRow key={providerName}>
                  <TableCell className="font-medium text-sm sticky left-0 bg-background">
                    {providerName}
                  </TableCell>
                  {models.map((model, i) => {
                    const price = pricingMatrix[model.slug]?.[providerName];
                    // Find cheapest input price across models for this provider
                    const allPrices = models
                      .map((m) => pricingMatrix[m.slug]?.[providerName]?.inputPricePerMillion)
                      .filter(Boolean) as number[];
                    const isCheapest =
                      price != null &&
                      allPrices.length > 1 &&
                      price.inputPricePerMillion === Math.min(...allPrices);

                    return (
                      <TableCell
                        key={model.slug}
                        className={cn(
                          "text-center",
                          i === 0 && "border-l",
                          isCheapest && "bg-emerald-500/5",
                        )}
                      >
                        {price ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center justify-center gap-1.5">
                              <span
                                className={cn(
                                  "font-mono text-sm font-semibold",
                                  isCheapest && "text-emerald-400",
                                )}
                              >
                                {formatPricePerMillion(price.inputPricePerMillion)}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                in
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {formatPricePerMillion(price.outputPricePerMillion)} out
                            </div>
                            {isCheapest && (
                              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] py-0 px-1">
                                Cheapest
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
