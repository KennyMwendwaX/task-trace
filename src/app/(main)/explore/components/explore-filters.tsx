"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { LuSearch, LuX } from "react-icons/lu";
import { useCallback } from "react";
import StatusFilterDropdown from "./status-dropdown";
import SortDropdown from "./sort-dropdown";

interface ExploreFiltersProps {
  initialSearch: string;
  initialFilter: string;
  initialSort: string;
}

export default function ExploreFilters({
  initialSearch,
  initialFilter,
  initialSort,
}: ExploreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrlParams = useCallback(
    (newSearch?: string, newFilter?: string, newSort?: string) => {
      const params = new URLSearchParams();

      // Only add parameters that have values and aren't default values
      if (newSearch) params.set("search", newSearch);
      if (newFilter && newFilter !== "ALL") params.set("filter", newFilter);
      if (newSort && newSort !== "date_desc") params.set("sort", newSort);

      // Create URL with only the active parameters
      const queryString = params.toString();
      router.push(queryString ? `/explore?${queryString}` : "/explore", {
        scroll: false,
      });
    },
    [router]
  );

  const handleSearchChange = (value: string) => {
    updateUrlParams(
      value || "", // Pass empty string if value is falsy
      searchParams.get("filter") || "ALL",
      searchParams.get("sort") || "date_desc"
    );
  };

  const handleStatusChange = (value: string) => {
    updateUrlParams(
      searchParams.get("search") || "",
      value,
      searchParams.get("sort") || "date_desc"
    );
  };

  const handleSortChange = (value: string) => {
    updateUrlParams(
      searchParams.get("search") || "",
      searchParams.get("filter") || "ALL",
      value
    );
  };

  const handleClearSearch = () => {
    handleSearchChange("");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:w-auto sm:flex-grow">
        <LuSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          className="w-full pl-8 pr-10 rounded-lg bg-background"
          value={initialSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        {initialSearch && (
          <button
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            onClick={handleClearSearch}>
            <LuX className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <StatusFilterDropdown
          currentFilter={initialFilter}
          onFilterChange={handleStatusChange}
        />
        <SortDropdown
          currentSort={initialSort}
          onSortChange={handleSortChange}
        />
      </div>
    </div>
  );
}
