import { Badge } from "@/components/ui/badge";
import { ModelContextBadge } from "./model-context-badge";
import type { ModelDetail } from "@/types/model";
import { cn } from "@/lib/utils";

interface ModelDetailHeaderProps {
  model: ModelDetail;
  className?: string;
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ModelDetailHeader({ model, className }: ModelDetailHeaderProps) {
  const releaseDate = formatDate(model.releaseDate);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Breadcrumb + title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <a
            href={`/models?developers=${model.developer.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {model.developer.name}
          </a>
          {model.modelFamily && (
            <>
              <span>·</span>
              <a
                href={`/models?families=${model.modelFamily}`}
                className="hover:text-foreground transition-colors"
              >
                {model.modelFamily}
              </a>
            </>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{model.name}</h1>

        {model.description && (
          <p className="text-base text-muted-foreground max-w-2xl">
            {model.description}
          </p>
        )}
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2">
        {model.contextWindow && (
          <ModelContextBadge contextWindow={model.contextWindow} />
        )}

        {model.maxOutputTokens && (
          <Badge variant="secondary" className="font-mono text-xs">
            {model.maxOutputTokens.toLocaleString()} max output
          </Badge>
        )}

        {model.paramSize && (
          <Badge variant="secondary" className="font-mono text-xs">
            {model.paramSize} params
          </Badge>
        )}

        {model.isOpenSource && (
          <Badge
            variant="outline"
            className="text-xs border-emerald-500/30 text-emerald-400"
          >
            Open Source
          </Badge>
        )}

        {model.isExperimental && (
          <Badge
            variant="outline"
            className="text-xs border-amber-500/30 text-amber-400"
          >
            Experimental
          </Badge>
        )}

        {releaseDate && (
          <span className="text-xs text-muted-foreground">
            Released {releaseDate}
          </span>
        )}
      </div>
    </div>
  );
}
