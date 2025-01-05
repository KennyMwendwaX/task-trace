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
import { LuArrowUpDown, LuCalendarDays, LuChevronDown } from "react-icons/lu";

interface SortDropdownProps {
  currentSort: string;
  onSortChange: (value: string) => void;
}

export function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const getSortIcon = (sortValue: string) => {
    switch (sortValue) {
      case "date_desc":
      case "date_asc":
        return <LuCalendarDays className="mr-2 h-4 w-4" />;
      case "name_asc":
      case "name_desc":
        return <LuArrowUpDown className="mr-2 h-4 w-4" />;
      default:
        return <LuCalendarDays className="mr-2 h-4 w-4" />;
    }
  };

  const getSortDisplayText = (sortValue: string) => {
    switch (sortValue) {
      case "date_desc":
        return "Date (Newest)";
      case "date_asc":
        return "Date (Oldest)";
      case "name_asc":
        return "Name (A-Z)";
      case "name_desc":
        return "Name (Z-A)";
      default:
        return "Sort by";
    }
  };

  return (
    <DropdownMenu>
      <div className="flex">
        <Button
          variant="outline"
          className="rounded-r-none border-r-0 pr-2 font-normal">
          {getSortIcon(currentSort)}
          {getSortDisplayText(currentSort)}
        </Button>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-l-none px-2">
            <LuChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => onSortChange("date_desc")}>
            <LuCalendarDays className="mr-2 h-4 w-4" />
            Date (Newest)
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onSortChange("date_asc")}>
            <LuCalendarDays className="mr-2 h-4 w-4" />
            Date (Oldest)
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onSortChange("name_asc")}>
            <LuArrowUpDown className="mr-2 h-4 w-4" />
            Name (A-Z)
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onSortChange("name_desc")}>
            <LuArrowUpDown className="mr-2 h-4 w-4" />
            Name (Z-A)
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
