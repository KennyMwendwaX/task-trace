"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bookmark, BookmarkX, ChevronDown, Heart } from "lucide-react";

interface BookmarkFilterDropdownProps {
  currentFilter: string;
  onFilterChange: (value: string) => void;
}

export default function BookmarkFilterDropdown({
  currentFilter,
  onFilterChange,
}: BookmarkFilterDropdownProps) {
  const getFilterIcon = (filterValue: string) => {
    switch (filterValue) {
      case "BOOKMARKED":
        return <Bookmark className="mr-2 h-4 w-4 text-yellow-600" />;
      case "NOT_BOOKMARKED":
        return <BookmarkX className="mr-2 h-4 w-4 text-muted-foreground" />;
      default:
        return <Heart className="mr-2 h-4 w-4" />;
    }
  };

  const getFilterDisplayText = (filterValue: string) => {
    switch (filterValue) {
      case "ALL":
        return "All Projects";
      case "BOOKMARKED":
        return "Bookmarked";
      case "NOT_BOOKMARKED":
        return "Not Bookmarked";
      default:
        return "Filter bookmarks";
    }
  };

  const getFilterBadgeColor = (filterValue: string) => {
    switch (filterValue) {
      case "BOOKMARKED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "NOT_BOOKMARKED":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "";
    }
  };

  return (
    <DropdownMenu>
      <div className="flex">
        <Button
          variant="outline"
          className={`rounded-r-none border-r-0 pr-2 font-normal ${
            currentFilter !== "ALL" ? getFilterBadgeColor(currentFilter) : ""
          }`}>
          {getFilterIcon(currentFilter)}
          {getFilterDisplayText(currentFilter)}
        </Button>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`rounded-l-none px-2 ${
              currentFilter !== "ALL" ? getFilterBadgeColor(currentFilter) : ""
            }`}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Filter by bookmarks</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => onFilterChange("ALL")}>
            <Heart className="mr-2 h-4 w-4" />
            All Projects
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onFilterChange("BOOKMARKED")}>
            <Bookmark className="mr-2 h-4 w-4 text-yellow-600" />
            Bookmarked Only
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onFilterChange("NOT_BOOKMARKED")}>
            <BookmarkX className="mr-2 h-4 w-4 text-muted-foreground" />
            Not Bookmarked
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
