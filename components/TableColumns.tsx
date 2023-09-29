"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { labels, priorities, statuses } from "@/data/IconMappingOptions";
import { Task } from "@/data/schema";
import TableColumnHeader from "./TableColumnHeader";
import TableRowActions from "./TableRowActions";

export const TableColumns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select-all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select-row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => <TableColumnHeader name="Task" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: () => <TableColumnHeader name="Title" />,
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <TableColumnHeader name="Status" />,
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.label === "Done" ? (
            <status.icon className="mr-2 h-5 w-5 text-muted-foreground text-green-600" />
          ) : status.label === "Todo" ? (
            <status.icon className="mr-2 h-5 w-5 text-muted-foreground text-blue-600" />
          ) : status.label === "In Progress" ? (
            <status.icon className="mr-2 h-5 w-5 text-muted-foreground text-orange-600" />
          ) : status.label === "Canceled" ? (
            <status.icon className="mr-2 h-5 w-5 text-muted-foreground text-red-600" />
          ) : status.label === "Backlog" ? (
            <status.icon className="mr-2 h-5 w-5 text-muted-foreground" />
          ) : null}
          <span>{status.label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: () => <TableColumnHeader name="Priority" />,
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center">
          {priority.label === "High" ? (
            <priority.icon className="mr-2 h-5 w-5 text-muted-foreground text-red-600" />
          ) : priority.label === "Medium" ? (
            <priority.icon className="mr-2 h-5 w-5 text-muted-foreground text-orange-500" />
          ) : priority.label === "Low" ? (
            <priority.icon className="mr-2 h-5 w-5 text-muted-foreground text-blue-600" />
          ) : null}
          <span>{priority.label}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TableRowActions row={row} />,
  },
];
