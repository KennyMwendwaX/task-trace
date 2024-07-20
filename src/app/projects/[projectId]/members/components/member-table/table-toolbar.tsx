"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { LuSearch } from "react-icons/lu";

interface TableToolbarProps<TData> {
  table: Table<TData>;
}

export default function TableToolbar<TData>({
  table,
}: TableToolbarProps<TData>) {
  return (
    <div className="relative w-full sm:w-auto">
      <LuSearch className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search members..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="h-8 pl-8 focus:border-2 focus:border-blue-600 w-full md:w-[250px]"
      />
    </div>
  );
}
