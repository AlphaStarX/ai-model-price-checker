import { ProviderGrid } from "@/components/features/providers/provider-grid";

export default function ProvidersLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="mt-1 h-4 w-96 bg-muted rounded animate-pulse" />
      </div>
      <ProviderGrid providers={[]} isLoading />
    </div>
  );
}
