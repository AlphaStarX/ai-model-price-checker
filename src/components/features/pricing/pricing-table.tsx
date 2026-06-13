import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { PricingRow } from "./pricing-row";
import { PricingSkeleton } from "./pricing-skeleton";
import type { PricingEntry } from "@/types/model";
import { cn } from "@/lib/utils";

interface PricingTableProps {
  entries: PricingEntry[];
  isLoading?: boolean;
  skeletonCount?: number;
  inputTokens?: number;
  outputTokens?: number;
  className?: string;
}

export function PricingTable({
  entries,
  isLoading = false,
  skeletonCount = 6,
  inputTokens,
  outputTokens,
  className,
}: PricingTableProps) {
  if (isLoading) {
    return <PricingSkeleton rowCount={skeletonCount} className={className} />;
  }

  if (entries.length === 0) {
    return (
      <div className={cn("space-y-3", className)}>
        <h2 className="text-lg font-semibold">Provider Pricing</h2>
        <div className="rounded-lg border border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No pricing data available for this model yet.
          </p>
        </div>
      </div>
    );
  }

  const showTotal = inputTokens != null && outputTokens != null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Provider Pricing
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({entries.length} provider{entries.length !== 1 ? "s" : ""})
          </span>
        </h2>
        {showTotal && (
          <span className="text-xs text-muted-foreground">
            Estimated cost for {inputTokens?.toLocaleString()} input +{" "}
            {outputTokens?.toLocaleString()} output tokens
          </span>
        )}
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[200px]">Provider</TableHead>
              <TableHead className="text-right">Input /1M</TableHead>
              <TableHead className="text-right">Output /1M</TableHead>
              <TableHead className="text-right">Cached /1M</TableHead>
              {showTotal && (
                <TableHead className="text-right">Est. Cost</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <PricingRow
                key={entry.id}
                entry={entry}
                isCheapest={
                  entries.length > 1 && entry.id === entries[0].id
                }
                inputTokens={inputTokens}
                outputTokens={outputTokens}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Prices in USD per 1 million tokens. Last verified:{" "}
        {new Date(entries[0]?.lastVerifiedAt).toLocaleDateString()}. Sorted by
        cheapest input price first.
      </p>
    </div>
  );
}
