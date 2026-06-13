// ─── Filter State Serialization ─────────────────────────────

import type { FilterState, FilterSort } from "@/types/filter";

/**
 * Default filter state when no filters are active.
 */
export const DEFAULT_FILTER_STATE: FilterState = {
  query: "",
  modelFamilies: [],
  developers: [],
  contextWindowRange: [0, 2_000_000],
  capabilities: [],
  sort: "name",
};

/**
 * Parse filter state from URL search params.
 * Used for server components that need to hydrate filter state from the URL.
 */
export function parseFilterParams(
  searchParams: URLSearchParams,
): Partial<FilterState> {
  return {
    query: searchParams.get("q") ?? undefined,
    modelFamilies: searchParams.get("families")?.split(",").filter(Boolean),
    developers: searchParams.get("developers")?.split(",").filter(Boolean),
    contextWindowRange: searchParams.get("context")
      ? (searchParams
          .get("context")!
          .split(",")
          .map(Number) as [number, number])
      : undefined,
    capabilities: searchParams.get("capabilities")?.split(",").filter(Boolean),
    sort: (searchParams.get("sort") as FilterSort) ?? undefined,
  };
}

/**
 * Serialize filter state to URL search params.
 */
export function serializeFilterParams(
  filters: Partial<FilterState>,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.modelFamilies?.length)
    params.set("families", filters.modelFamilies.join(","));
  if (filters.developers?.length)
    params.set("developers", filters.developers.join(","));
  if (filters.contextWindowRange)
    params.set("context", filters.contextWindowRange.join(","));
  if (filters.capabilities?.length)
    params.set("capabilities", filters.capabilities.join(","));
  if (filters.sort && filters.sort !== "name") params.set("sort", filters.sort);

  return params;
}
