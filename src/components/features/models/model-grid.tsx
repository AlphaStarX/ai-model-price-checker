import { ModelCard } from "./model-card";
import { ModelCardSkeleton } from "./model-card-skeleton";
import type { ModelSummary } from "@/types/model";
import { cn } from "@/lib/utils";

interface ModelGridProps {
  models: ModelSummary[];
  isLoading?: boolean;
  skeletonCount?: number;
  className?: string;
}

export function ModelGrid({
  models,
  isLoading = false,
  skeletonCount = 12,
  className,
}: ModelGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
          className,
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ModelCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground">No models found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {models.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </div>
  );
}
