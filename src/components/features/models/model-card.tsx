import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModelContextBadge } from "./model-context-badge";
import type { ModelSummary } from "@/types/model";
import { cn } from "@/lib/utils";

interface ModelCardProps {
  model: ModelSummary;
  className?: string;
}

export function ModelCard({ model, className }: ModelCardProps) {
  const showCapabilities = model.capabilities.slice(0, 4);
  const remainingCount = model.capabilities.length - 4;

  return (
    <Link href={`/models/${model.slug}`} className={cn("group block", className)}>
      <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-base font-semibold truncate group-hover:text-primary transition-colors">
                {model.name}
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                {model.developer.name}
              </CardDescription>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </div>
        </CardHeader>

        <div className="px-6 pb-3 space-y-2">
          {/* Context window + model family */}
          <div className="flex flex-wrap items-center gap-1.5">
            {model.contextWindow && (
              <ModelContextBadge contextWindow={model.contextWindow} />
            )}
            {model.modelFamily && (
              <Badge variant="secondary" className="text-xs">
                {model.modelFamily}
              </Badge>
            )}
          </div>

          {/* Capabilities */}
          {showCapabilities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {showCapabilities.map((cap) => (
                <Badge
                  key={cap.slug}
                  variant="outline"
                  className="text-[10px] py-0 px-1.5 border-border/60 text-muted-foreground"
                >
                  {cap.label}
                </Badge>
              ))}
              {remainingCount > 0 && (
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 px-1.5 border-border/60 text-muted-foreground"
                >
                  +{remainingCount}
                </Badge>
              )}
            </div>
          )}
        </div>

        <CardFooter className="pt-0">
          <div className="flex items-baseline justify-between w-full">
            <span className="text-xs text-muted-foreground">
              {model.pricingCount} provider{model.pricingCount !== 1 ? "s" : ""}
            </span>
            {model.cheapestPrice != null && (
              <span className="text-xs font-mono font-medium text-emerald-400">
                from ${model.cheapestPrice.toFixed(2)}/M
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
