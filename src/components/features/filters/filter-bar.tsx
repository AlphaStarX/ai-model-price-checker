"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { FilterCheckboxGroup } from "./filter-checkbox-group";
import { FilterSelect } from "./filter-select";
import type { FilterOptions, FilterSort } from "@/types/filter";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  modelFamilies: string[];
  developers: string[];
  capabilities: string[];
  sort: FilterSort;
  filterOptions: FilterOptions;
  onModelFamiliesChange: (v: string[]) => void;
  onDevelopersChange: (v: string[]) => void;
  onCapabilitiesChange: (v: string[]) => void;
  onSortChange: (v: FilterSort) => void;
  resultCount: number;
  className?: string;
}

const SORT_OPTIONS: { value: FilterSort; label: string }[] = [
  { value: "name", label: "Name (A-Z)" },
  { value: "contextWindow", label: "Largest Context" },
  { value: "releaseDate", label: "Newest First" },
  { value: "cheapestPrice", label: "Cheapest" },
];

export function FilterBar({
  modelFamilies,
  developers,
  capabilities,
  sort,
  filterOptions,
  onModelFamiliesChange,
  onDevelopersChange,
  onCapabilitiesChange,
  onSortChange,
  resultCount,
  className,
}: FilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeFilterCount =
    modelFamilies.length + developers.length + capabilities.length;

  const FilterContent = () => (
    <div className="space-y-6">
      <FilterSelect
        title="Sort by"
        value={sort}
        onChange={onSortChange}
        options={SORT_OPTIONS}
      />

      <Separator />

      <FilterCheckboxGroup
        title="Model Family"
        options={filterOptions.modelFamilies}
        selected={modelFamilies}
        onChange={onModelFamiliesChange}
      />

      <Separator />

      <FilterCheckboxGroup
        title="Developer"
        options={filterOptions.developers}
        selected={developers}
        onChange={onDevelopersChange}
      />

      <Separator />

      <FilterCheckboxGroup
        title="Capabilities"
        options={filterOptions.capabilities}
        selected={capabilities}
        onChange={onCapabilitiesChange}
      />
    </div>
  );

  const clearAll = () => {
    onModelFamiliesChange([]);
    onDevelopersChange([]);
    onCapabilitiesChange([]);
  };

  return (
    <div className={cn("flex items-start gap-4", className)}>
      {/* Desktop sidebar filters */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-20 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filters</h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{resultCount} results</p>
          <div className="mt-4">
            <FilterContent />
          </div>
        </div>
      </aside>

      {/* Mobile filter sheet */}
      <div className="lg:hidden flex items-center gap-2 w-full">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            }
          />
          <SheetContent side="left" className="w-[300px] p-0">
            <SheetHeader className="px-4 pt-6 pb-4 border-b">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-base font-semibold">
                  Filters
                </SheetTitle>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="h-7 text-xs text-muted-foreground"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {resultCount} results
              </p>
            </SheetHeader>
            <div className="p-4">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>

        <FilterSelect
          title=""
          value={sort}
          onChange={onSortChange}
          options={SORT_OPTIONS}
          className="w-40"
        />
      </div>
    </div>
  );
}
