"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { CalculatorResult } from "@/types/model";
import { cn } from "@/lib/utils";

interface CostBreakdownProps {
  results: CalculatorResult[];
  isLoading: boolean;
  modelName?: string;
  inputTokens: number;
  outputTokens: number;
  className?: string;
}

export function CostBreakdown({
  results,
  isLoading,
  modelName,
  inputTokens,
  outputTokens,
  className,
}: CostBreakdownProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Provider</TableHead>
                <TableHead className="text-right">Input Cost</TableHead>
                <TableHead className="text-right">Output Cost</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Estimated Costs
          {modelName && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              for {modelName}
            </span>
          )}
        </h2>
        <span className="text-xs text-muted-foreground">
          {inputTokens.toLocaleString()} input + {outputTokens.toLocaleString()} output tokens
        </span>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[220px]">Provider</TableHead>
              <TableHead className="text-right">Input Cost</TableHead>
              <TableHead className="text-right">Output Cost</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow
                key={result.providerSlug}
                className={cn(
                  result.isCheapest && "bg-emerald-500/5",
                )}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/providers/${result.providerSlug}`}
                      className="hover:text-primary transition-colors hover:underline"
                    >
                      {result.providerName}
                    </Link>
                    {result.isCheapest && (
                      <Badge className="bg-emerald-500/10 text-primary border-emerald-500/20 text-[10px] py-0 px-1.5 font-medium">
                        Cheapest
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-sm tabular-nums">
                  ${result.inputCost.toFixed(4)}
                </TableCell>
                <TableCell className="text-right font-mono text-sm tabular-nums">
                  ${result.outputCost.toFixed(4)}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-mono text-sm tabular-nums font-semibold",
                    result.isCheapest ? "text-primary" : "text-foreground",
                  )}
                >
                  ${result.totalCost.toFixed(4)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Sorted by cheapest total cost. Prices in USD.
      </p>
    </div>
  );
}
