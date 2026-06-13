import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ProviderStatusBadge } from "./provider-status-badge";
import type { ProviderSummary } from "@/types/model";
import { cn } from "@/lib/utils";

interface ProviderCardProps {
  provider: ProviderSummary;
  className?: string;
}

export function ProviderCard({ provider, className }: ProviderCardProps) {
  return (
    <Link
      href={`/providers/${provider.slug}`}
      className={cn("group block", className)}
    >
      <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-base font-semibold truncate group-hover:text-primary transition-colors">
                {provider.name}
              </CardTitle>
              {provider.description && (
                <CardDescription className="mt-1 text-xs line-clamp-2">
                  {provider.description}
                </CardDescription>
              )}
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </div>
        </CardHeader>

        <CardFooter className="flex items-center justify-between pt-0">
          <ProviderStatusBadge status={provider.status} />
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            {provider.modelCount} model{provider.modelCount !== 1 ? "s" : ""}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
