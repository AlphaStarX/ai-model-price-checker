"use client";

import type { CalculatorResult } from "@/types/model";
import { cn } from "@/lib/utils";

interface CostChartProps {
  results: CalculatorResult[];
  className?: string;
}

export function CostChart({ results, className }: CostChartProps) {
  if (results.length === 0) return null;

  // Find max cost for relative bar widths
  const maxCost = results.reduce(
    (max, r) => Math.max(max, r.totalCost),
    0,
  );

  return (
    <div className={cn("space-y-3", className)}>
      <h2 className="text-lg font-semibold">Cost Comparison</h2>

      <div className="space-y-2">
        {results.map((result) => {
          const width = maxCost > 0 ? (result.totalCost / maxCost) * 100 : 0;

          return (
            <div key={result.providerSlug} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span
                  className={cn(
                    "font-medium",
                    result.isCheapest && "text-emerald-400",
                  )}
                >
                  {result.providerName}
                  {result.isCheapest && (
                    <span className="ml-2 text-[10px] uppercase tracking-wider">
                      cheapest
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "font-mono tabular-nums",
                    result.isCheapest
                      ? "text-emerald-400 font-semibold"
                      : "text-muted-foreground",
                  )}
                >
                  ${result.totalCost.toFixed(4)}
                </span>
              </div>

              {/* Bar */}
              <div className="relative h-6 w-full rounded-sm bg-muted overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-sm transition-all duration-300",
                    result.isCheapest
                      ? "bg-primary"
                      : "bg-primary/60",
                  )}
                  style={{ width: `${Math.max(width, 0.5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
