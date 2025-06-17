"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { LuSearch, LuX, LuFilter } from "react-icons/lu";
import { useCallback } from "react";
import StatusFilterDropdown from "./status-dropdown";
import BookmarkFilterDropdown from "./bookmark-dropdown";
import SortDropdown from "./sort-dropdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExploreFiltersProps {
  initialSearch: string;
  initialFilter: string;
  initialSort: string;
  initialBookmarkFilter: string;
}

export default function ExploreFilters({
  initialSearch,
  initialFilter,
  initialSort,
  initialBookmarkFilter,
}: ExploreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrlParams = useCallback(
    (
      newSearch?: string,
      newFilter?: string,
      newSort?: string,
      newBookmarkFilter?: string
    ) => {
      const params = new URLSearchParams();

      // Only add parameters that have values and aren't default values
      if (newSearch) params.set("search", newSearch);
      if (newFilter && newFilter !== "ALL") params.set("filter", newFilter);
      if (newSort && newSort !== "date_desc") params.set("sort", newSort);
      if (newBookmarkFilter && newBookmarkFilter !== "ALL")
        params.set("bookmarks", newBookmarkFilter);

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
      searchParams.get("sort") || "date_desc",
      searchParams.get("bookmarks") || "ALL"
    );
  };

  const handleStatusChange = (value: string) => {
    updateUrlParams(
      searchParams.get("search") || "",
      value,
      searchParams.get("sort") || "date_desc",
      searchParams.get("bookmarks") || "ALL"
    );
  };

  const handleSortChange = (value: string) => {
    updateUrlParams(
      searchParams.get("search") || "",
      searchParams.get("filter") || "ALL",
      value,
      searchParams.get("bookmarks") || "ALL"
    );
  };

  const handleBookmarkFilterChange = (value: string) => {
    updateUrlParams(
      searchParams.get("search") || "",
      searchParams.get("filter") || "ALL",
      searchParams.get("sort") || "date_desc",
      value
    );
  };

  const handleClearSearch = () => {
    handleSearchChange("");
  };

  const handleClearAllFilters = () => {
    router.push("/explore", { scroll: false });
  };

  const activeFilters = [
    initialSearch,
    initialFilter !== "ALL" ? initialFilter : null,
    initialBookmarkFilter !== "ALL" ? initialBookmarkFilter : null,
  ].filter(Boolean);

  const hasActiveFilters =
    activeFilters.length > 0 || initialSort !== "date_desc";

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative w-full">
        <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects by name..."
          className="w-full pl-10 pr-10 h-11 rounded-lg bg-background border-border/60 focus:border-primary/60 transition-colors"
          value={initialSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        {initialSearch && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={handleClearSearch}
            aria-label="Clear search">
            <LuX className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <LuFilter className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          <StatusFilterDropdown
            currentFilter={initialFilter}
            onFilterChange={handleStatusChange}
          />

          <BookmarkFilterDropdown
            currentFilter={initialBookmarkFilter}
            onFilterChange={handleBookmarkFilterChange}
          />

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAllFilters}
              className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-2">
              Clear all
            </Button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SortDropdown
            currentSort={initialSort}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {initialSearch && (
            <Badge variant="secondary" className="text-xs">
              Search: "{initialSearch}"
              <button
                onClick={handleClearSearch}
                className="ml-1 hover:text-destructive">
                <LuX className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {initialFilter !== "ALL" && (
            <Badge variant="secondary" className="text-xs">
              Status: {initialFilter}
              <button
                onClick={() => handleStatusChange("ALL")}
                className="ml-1 hover:text-destructive">
                <LuX className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {initialBookmarkFilter !== "ALL" && (
            <Badge variant="secondary" className="text-xs">
              Bookmarks:{" "}
              {initialBookmarkFilter === "BOOKMARKED"
                ? "Only bookmarked"
                : "Not bookmarked"}
              <button
                onClick={() => handleBookmarkFilterChange("ALL")}
                className="ml-1 hover:text-destructive">
                <LuX className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
