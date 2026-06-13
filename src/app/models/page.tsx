"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ModelSearchInput } from "@/components/features/models/model-search-input";
import { ModelGrid } from "@/components/features/models/model-grid";
import { FilterBar } from "@/components/features/filters/filter-bar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { parseFilterParams, serializeFilterParams } from "@/lib/filters";
import type { FilterSort } from "@/types/filter";
import type { ModelSummary, FilterOptions } from "@/types/model";
import { MODELS_PER_PAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";

async function fetchModels(
  params: URLSearchParams,
): Promise<{
  models: ModelSummary[];
  total: number;
  filterOptions: FilterOptions;
}> {
  const res = await fetch(`/api/models?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch models");
  return res.json();
}

export default function ModelsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);

  // Parse initial state from URL
  const initialFilters = parseFilterParams(searchParams);

  const [query, setQuery] = useState(initialFilters.query ?? "");
  const [modelFamilies, setModelFamilies] = useState<string[]>(
    initialFilters.modelFamilies ?? [],
  );
  const [developers, setDevelopers] = useState<string[]>(
    initialFilters.developers ?? [],
  );
  const [capabilities, setCapabilities] = useState<string[]>(
    initialFilters.capabilities ?? [],
  );
  const [sort, setSort] = useState<FilterSort>(initialFilters.sort ?? "name");

  // Sync URL with filter state
  const syncUrl = useCallback(() => {
    const params = serializeFilterParams({
      query: query || undefined,
      modelFamilies,
      developers,
      capabilities,
      sort,
    });
    if (page > 1) params.set("page", String(page));
    router.replace(`/models?${params.toString()}`, { scroll: false });
  }, [query, modelFamilies, developers, capabilities, sort, page, router]);

  // Build query params for API call
  const queryParams = new URLSearchParams();
  if (query) queryParams.set("q", query);
  if (modelFamilies.length) queryParams.set("families", modelFamilies.join(","));
  if (developers.length) queryParams.set("developers", developers.join(","));
  if (capabilities.length) queryParams.set("capabilities", capabilities.join(","));
  if (sort) queryParams.set("sort", sort);
  queryParams.set("page", String(page));
  queryParams.set("limit", String(MODELS_PER_PAGE));

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["models", queryParams.toString()],
    queryFn: () => fetchModels(queryParams),
    staleTime: 30_000,
  });

  // Sync URL when filters change
  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  // Reset page when filters change
  const handleQueryChange = useCallback((v: string) => {
    setQuery(v);
    setPage(1);
  }, []);
  const handleFamiliesChange = useCallback((v: string[]) => {
    setModelFamilies(v);
    setPage(1);
  }, []);
  const handleDevelopersChange = useCallback((v: string[]) => {
    setDevelopers(v);
    setPage(1);
  }, []);
  const handleCapabilitiesChange = useCallback((v: string[]) => {
    setCapabilities(v);
    setPage(1);
  }, []);
  const handleSortChange = useCallback((v: FilterSort) => {
    setSort(v);
    setPage(1);
  }, []);

  const totalPages = data ? Math.ceil(data.total / MODELS_PER_PAGE) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">AI Models</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compare pricing and capabilities across every tracked model.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <ModelSearchInput
          value={query}
          onChange={handleQueryChange}
          placeholder="Search by model name, developer, or family..."
          className="max-w-lg"
        />
      </div>

      {/* Filters + Grid */}
      <div className="flex gap-6">
        <FilterBar
          modelFamilies={modelFamilies}
          developers={developers}
          capabilities={capabilities}
          sort={sort}
          filterOptions={
            data?.filterOptions ?? {
              modelFamilies: [],
              developers: [],
              contextWindowRange: { min: 0, max: 2_000_000 },
              capabilities: [],
            }
          }
          onModelFamiliesChange={handleFamiliesChange}
          onDevelopersChange={handleDevelopersChange}
          onCapabilitiesChange={handleCapabilitiesChange}
          onSortChange={handleSortChange}
          resultCount={data?.total ?? 0}
        />

        <div className="flex-1 min-w-0">
          {/* Error state */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg font-medium text-destructive">
                Failed to load models
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "Please try again."}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Grid */}
          {!isError && (
            <ModelGrid
              models={data?.models ?? []}
              isLoading={isLoading}
            />
          )}

          {/* Pagination */}
          {data && totalPages > 1 && (
            <>
              <Separator className="my-8" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {(page - 1) * MODELS_PER_PAGE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-foreground">
                    {Math.min(page * MODELS_PER_PAGE, data.total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {data.total}
                  </span>{" "}
                  models
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
