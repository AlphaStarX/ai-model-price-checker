import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Clock, AlertTriangle } from "lucide-react";
import { getProviderBySlug } from "@/server/actions/providers";
import { buildMetadata } from "@/lib/metadata";
import { ProviderStatusBadge } from "@/components/features/providers/provider-status-badge";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatPricePerMillion } from "@/lib/pricing-calc";

interface ProviderPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProviderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    return { title: "Provider Not Found" };
  }

  return buildMetadata({
    title: `${provider.name} — Models & Pricing`,
    description:
      provider.description ??
      `${provider.name} offers ${provider.models.length} AI models. Compare pricing and find documentation.`,
    path: `/providers/${provider.slug}`,
  });
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            {provider.name}
          </h1>
          <ProviderStatusBadge status={provider.status} />
        </div>

        {provider.description && (
          <p className="text-sm text-muted-foreground max-w-2xl">
            {provider.description}
          </p>
        )}

        {/* Links row */}
        <div className="flex flex-wrap items-center gap-2">
          {provider.website && (
            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5",
              )}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Website
            </a>
          )}
          {provider.docsUrl && (
            <a
              href={provider.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5",
              )}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              API Docs
            </a>
          )}
          {provider.apiFormat && (
            <Badge variant="secondary" className="text-xs font-mono">
              API: {provider.apiFormat}
            </Badge>
          )}
          {provider.lastFetchedAt && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Updated{" "}
              {new Date(provider.lastFetchedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {provider.consecutiveScrapeFailures >= 3 && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Pricing scraper has failed {provider.consecutiveScrapeFailures} times
            consecutively. Prices may be stale.
            {provider.lastScrapeFailedAt && (
              <span className="text-red-400/60">
                Last attempt:{" "}
                {new Date(provider.lastScrapeFailedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
        {provider.status !== "active" && provider.consecutiveScrapeFailures < 3 && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            This provider is currently experiencing issues. Pricing data may be
            stale.
          </div>
        )}
      </div>

      <Separator className="my-8" />

      {/* Models list */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          Supported Models
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({provider.models.length})
          </span>
        </h2>

        {provider.models.length === 0 ? (
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No model pricing data available yet for this provider.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Model</TableHead>
                  <TableHead>Family</TableHead>
                  <TableHead className="text-right">Context</TableHead>
                  <TableHead className="text-right">Input /1M</TableHead>
                  <TableHead className="text-right">Output /1M</TableHead>
                  <TableHead className="text-right">Cached /1M</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {provider.models.map((m) => (
                  <TableRow key={m.modelSlug}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/models/${m.modelSlug}`}
                        className="hover:text-primary transition-colors hover:underline"
                      >
                        {m.modelName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {m.modelFamily && (
                        <Badge variant="secondary" className="text-xs">
                          {m.modelFamily}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground tabular-nums">
                      {m.contextWindow
                        ? m.contextWindow >= 1_000_000
                          ? `${m.contextWindow / 1_000_000}M`
                          : `${(m.contextWindow / 1_000).toFixed(0)}K`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {formatPricePerMillion(m.inputPricePerMillion)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums">
                      {formatPricePerMillion(m.outputPricePerMillion)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm tabular-nums text-muted-foreground">
                      {m.cachedInputPricePerMillion != null
                        ? formatPricePerMillion(m.cachedInputPricePerMillion)
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
