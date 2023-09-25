"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import TableFacetedFilter from "./TableFacetedFilter";
import { priorities, statuses } from "@/data/IconMappingOptions";
import { Button } from "./ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

interface TableToolbarProps<TData> {
  table: Table<TData>;
}

export default function TableToolbar<TData>({
  table,
}: TableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search tasks..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn("title")?.setFilterValue(event.target.value);
            }}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {table.getColumn("status") && (
            <TableFacetedFilter
              column={table.getColumn("status")}
              title="status"
              options={statuses}
            />
          )}
          {table.getColumn("priority") && (
            <TableFacetedFilter
              column={table.getColumn("priority")}
              title="priority"
              options={priorities}
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
    </>
  );
}
