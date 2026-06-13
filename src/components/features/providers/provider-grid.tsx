import { ProviderCard } from "./provider-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProviderSummary } from "@/types/model";
import { cn } from "@/lib/utils";

interface ProviderGridProps {
  providers: ProviderSummary[];
  isLoading?: boolean;
  skeletonCount?: number;
  className?: string;
}

function ProviderCardSkeleton() {
  return (
    <div className="rounded-lg border border-border p-6 space-y-3">
      <div className="space-y-1.5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-3.5 w-16" />
      </div>
    </div>
  );
}

export function ProviderGrid({
  providers,
  isLoading = false,
  skeletonCount = 6,
  className,
}: ProviderGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
          className,
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProviderCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground">No providers found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Provider data is being fetched. Check back soon.
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
      {providers.map((provider) => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </div>
  );
}
