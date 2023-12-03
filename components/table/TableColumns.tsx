"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { labels, priorities, statuses } from "@/lib/taskConfig";
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
    accessorKey: "name",
    header: () => <TableColumnHeader name="Name" />,
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      if (!label) {
        return (
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        );
      }
      return (
        <div className="flex space-x-2">
          {label.value === "feature" ? (
            <Badge className="border-blue-600 text-blue-600" variant="outline">
              {label.label}
            </Badge>
          ) : label.value === "documentation" ? (
            <Badge
              className="border-purple-600 text-purple-600"
              variant="outline">
              {label.label}
            </Badge>
          ) : label.value === "bug" ? (
            <Badge
              className="border-orange-600 text-orange-600"
              variant="outline">
              {label.label}
            </Badge>
          ) : null}
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
        <div className="flex items-center">
          {status.value === "done" ? (
            <status.icon className="mr-2 h-5 w-5 text-green-600" />
          ) : status.value === "todo" ? (
            <status.icon className="mr-2 h-5 w-5 text-blue-600" />
          ) : status.value === "in progress" ? (
            <status.icon className="mr-2 h-5 w-5 text-orange-600" />
          ) : status.value === "canceled" ? (
            <status.icon className="mr-2 h-5 w-5 text-red-600" />
          ) : status.value === "backlog" ? (
            <status.icon className="mr-2 h-5 w-5 text-gray-600" />
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
          {priority.value === "high" ? (
            <priority.icon className="mr-2 h-5 w-5 text-muted-foreground text-red-600" />
          ) : priority.value === "medium" ? (
            <priority.icon className="mr-2 h-5 w-5 text-muted-foreground text-orange-500" />
          ) : priority.value === "low" ? (
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
