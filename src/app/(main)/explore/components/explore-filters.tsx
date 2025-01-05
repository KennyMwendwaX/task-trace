"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { LuSearch } from "react-icons/lu";
import { useCallback } from "react";
import FilterDropdown from "./filter-dropdown";
import { SortDropdown } from "./sort-dropdown";

interface ExploreFiltersProps {
  initialSearch: string;
  initialFilter: string;
  initialSort: string;
}

export function ExploreFilters({
  initialSearch,
  initialFilter,
  initialSort,
}: ExploreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrlParams = useCallback(
    (newSearch?: string, newFilter?: string, newSort?: string) => {
      const params = new URLSearchParams(searchParams);
      if (newSearch !== undefined) params.set("search", newSearch);
      if (newFilter !== undefined) params.set("filter", newFilter);
      if (newSort !== undefined) params.set("sort", newSort);
      router.push(`/explore?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:w-auto sm:flex-grow">
        <LuSearch className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          className="w-full pl-8 rounded-lg bg-background sm:w-[200px] md:w-[400px]"
          defaultValue={initialSearch}
          onChange={(e) =>
            updateUrlParams(e.target.value, initialFilter, initialSort)
          }
        />
      </div>
      <div className="flex gap-2">
        <FilterDropdown
          currentFilter={initialFilter}
          onFilterChange={(value) =>
            updateUrlParams(initialSearch, value, initialSort)
          }
        />
        <SortDropdown
          currentSort={initialSort}
          onSortChange={(value) =>
            updateUrlParams(initialSearch, initialFilter, value)
          }
        />
      </div>
    </div>
  );
}
