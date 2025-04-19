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
import { LuChevronDown, LuSlidersHorizontal } from "react-icons/lu";

interface StatusFilterDropdownProps {
  currentFilter: string;
  onFilterChange: (value: string) => void;
}

export default function StatusFilterDropdown({
  currentFilter,
  onFilterChange,
}: StatusFilterDropdownProps) {
  const getFilterIcon = (filterValue: string) => {
    switch (filterValue) {
      case "BUILDING":
        return <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />;
      case "LIVE":
        return <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />;
      default:
        return <LuSlidersHorizontal className="mr-2 h-4 w-4" />;
    }
  };

  const getFilterDisplayText = (filterValue: string) => {
    switch (filterValue) {
      case "ALL":
        return "All Statuses";
      case "BUILDING":
        return "Building";
      case "LIVE":
        return "Live";
      default:
        return "Filter by status";
    }
  };

  return (
    <DropdownMenu>
      <div className="flex">
        <Button
          variant="outline"
          className="rounded-r-none border-r-0 pr-2 font-normal">
          {getFilterIcon(currentFilter)}
          {getFilterDisplayText(currentFilter)}
        </Button>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-l-none px-2">
            <LuChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => onFilterChange("ALL")}>
            <LuSlidersHorizontal className="mr-2 h-4 w-4" />
            All Statuses
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onFilterChange("BUILDING")}>
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
            Building
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onFilterChange("LIVE")}>
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            Live
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
