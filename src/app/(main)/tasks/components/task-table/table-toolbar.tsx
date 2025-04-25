"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import TableFacetedFilter from "./table-faceted-filter";
import { priorities, statuses } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { LuSearch } from "react-icons/lu";

interface TableToolbarProps<TData> {
  table: Table<TData>;
}

export default function TableToolbar<TData>({
  table,
}: TableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      <div className="relative w-full sm:w-auto">
        <LuSearch className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tasks..."
          className="h-8 pl-8 w-full md:w-[250px] bg-background"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {table.getColumn("status") && (
          <TableFacetedFilter
            column={table.getColumn("status")}
            name="Status"
            options={[...statuses]}
          />
        )}
        {table.getColumn("priority") && (
          <TableFacetedFilter
            column={table.getColumn("priority")}
            name="Priority"
            options={[...priorities]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
