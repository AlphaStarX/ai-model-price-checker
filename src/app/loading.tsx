import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8 p-4 sm:p-6">
      {/* Hero skeleton */}
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <Skeleton className="h-12 w-3/4 max-w-xl" />
        <Skeleton className="h-6 w-2/3 max-w-lg" />
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
