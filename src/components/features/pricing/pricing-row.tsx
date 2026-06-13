import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import type { PricingEntry } from "@/types/model";
import { formatPricePerMillion } from "@/lib/pricing-calc";
import { cn } from "@/lib/utils";

interface PricingRowProps {
  entry: PricingEntry;
  isCheapest: boolean;
  inputTokens?: number;
  outputTokens?: number;
  highlight?: boolean;
}

export function PricingRow({
  entry,
  isCheapest,
  inputTokens,
  outputTokens,
  highlight,
}: PricingRowProps) {
  const total =
    inputTokens != null && outputTokens != null
      ? (inputTokens / 1_000_000) * entry.inputPricePerMillion +
        (outputTokens / 1_000_000) * entry.outputPricePerMillion
      : null;

  return (
    <TableRow
      className={cn(
        "group",
        highlight && "bg-primary/5",
        isCheapest && "bg-emerald-500/5",
      )}
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <Link
            href={`/providers/${entry.provider.slug}`}
            className="hover:text-primary transition-colors hover:underline"
          >
            {entry.provider.name}
          </Link>
          {isCheapest && (
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] py-0 px-1.5 font-medium">
              Cheapest
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {entry.provider.status !== "active" && (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] py-0 px-1",
                entry.provider.status === "degraded" &&
                  "border-amber-500/30 text-amber-400",
                entry.provider.status === "down" &&
                  "border-red-500/30 text-red-400",
              )}
            >
              {entry.provider.status}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right font-mono text-sm tabular-nums">
        {formatPricePerMillion(entry.inputPricePerMillion)}
      </TableCell>
      <TableCell className="text-right font-mono text-sm tabular-nums">
        {formatPricePerMillion(entry.outputPricePerMillion)}
      </TableCell>
      <TableCell className="text-right font-mono text-sm tabular-nums text-muted-foreground">
        {entry.cachedInputPricePerMillion != null
          ? formatPricePerMillion(entry.cachedInputPricePerMillion)
          : "—"}
      </TableCell>
      {total != null && (
        <TableCell
          className={cn(
            "text-right font-mono text-sm tabular-nums font-semibold",
            isCheapest ? "text-emerald-400" : "text-foreground",
          )}
        >
          ${total.toFixed(4)}
        </TableCell>
      )}
    </TableRow>
  );
}
