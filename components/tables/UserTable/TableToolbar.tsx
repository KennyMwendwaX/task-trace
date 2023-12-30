"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";

interface TableToolbarProps<TData> {
  table: Table<TData>;
}

export default function TableToolbar<TData>({
  table,
}: TableToolbarProps<TData>) {
  return (
    <>
      <Input
        placeholder="Search members..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="h-8 focus:border-2 focus:border-blue-600 w-[150px] lg:w-[250px]"
      />
    </>
  );
}
