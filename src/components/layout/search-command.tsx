"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { SearchResult } from "@/types/model";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SEARCH_INDEX_CACHE: SearchResult[] | null = null;

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Open with Ctrl/Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`,
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.results ?? []);
        }
      } catch {
        // Fallback: client-side filter against empty state
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      onOpenChange(false);
      setQuery("");
      router.push(`/${result.type === "model" ? "models" : "providers"}/${result.slug}`);
    },
    [router, onOpenChange],
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search models and providers..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isLoading && (
          <div className="p-4 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
          </div>
        )}

        {!isLoading && query && results.length === 0 && (
          <CommandEmpty>No results found for &ldquo;{query}&rdquo;</CommandEmpty>
        )}

        {!isLoading && results.length > 0 && (
          <>
            <CommandGroup heading="Models">
              {results
                .filter((r) => r.type === "model")
                .map((result) => (
                  <CommandItem
                    key={result.slug}
                    value={result.name}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span>{result.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {result.subtitle}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CommandItem>
                ))}
            </CommandGroup>
            {results.some((r) => r.type === "provider") && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Providers">
                  {results
                    .filter((r) => r.type === "provider")
                    .map((result) => (
                      <CommandItem
                        key={result.slug}
                        value={result.name}
                        onSelect={() => handleSelect(result)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex flex-col">
                          <span>{result.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {result.subtitle}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </CommandItem>
                    ))}
                </CommandGroup>
              </>
            )}
          </>
        )}

        {!query && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>Search for models like GPT-4.1, Claude Sonnet, or Gemini</p>
            <p className="text-xs mt-1">
              Press{" "}
              <kbd className="px-1.5 py-0.5 text-xs rounded border bg-muted">
                ⌘K
              </kbd>{" "}
              to open search anytime
            </p>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}
