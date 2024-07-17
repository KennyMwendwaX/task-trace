"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { labels, priorities, statuses } from "@/lib/config";
import { UserTask, userTaskSchema } from "@/lib/schema/TaskSchema";
import TableColumnHeader from "./table-column-header";
import TableRowActions from "./table-row-actions";
import format from "date-fns/format";
import Link from "next/link";

export const TableColumns: ColumnDef<UserTask>[] = [
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
      const task = userTaskSchema.parse(row.original);
      const label = labels.find((label) => label.value === row.original.label);

      if (!label) {
        return (
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        );
      }
      return (
        <div className="flex space-x-2">
          {label.value === "FEATURE" ? (
            <Badge className="border-blue-600 text-blue-600" variant="outline">
              {label.label}
            </Badge>
          ) : label.value === "DOCUMENTATION" ? (
            <Badge
              className="border-purple-600 text-purple-600"
              variant="outline">
              {label.label}
            </Badge>
          ) : label.value === "BUG" ? (
            <Badge
              className="border-amber-600 text-amber-600"
              variant="outline">
              {label.label}
            </Badge>
          ) : label.value === "ERROR" ? (
            <Badge className="border-red-600 text-red-600" variant="outline">
              {label.label}
            </Badge>
          ) : null}
          <span className="max-w-[500px] truncate font-medium">
            <Link
              className="hover:underline"
              href={`/projects/${task.projectId}/tasks/${task.id}`}>
              {row.getValue("name")}
            </Link>
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
          {status.value === "DONE" ? (
            <status.icon className="mr-2 h-5 w-5 text-green-600" />
          ) : status.value === "TO_DO" ? (
            <status.icon className="mr-2 h-5 w-5 text-blue-600" />
          ) : status.value === "IN_PROGRESS" ? (
            <status.icon className="mr-2 h-5 w-5 text-orange-600" />
          ) : status.value === "CANCELED" ? (
            <status.icon className="mr-2 h-5 w-5 text-red-600" />
          ) : null}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
          {priority.value === "HIGH" ? (
            <priority.icon className="mr-2 h-5 w-5 text-muted-foreground text-red-600" />
          ) : priority.value === "MEDIUM" ? (
            <priority.icon className="mr-2 h-5 w-5 text-muted-foreground text-orange-500" />
          ) : priority.value === "LOW" ? (
            <priority.icon className="mr-2 h-5 w-5 text-muted-foreground text-blue-600" />
          ) : null}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "dueDate",
    header: () => <TableColumnHeader name="Due Date" />,
    cell: ({ row }) => {
      const task = userTaskSchema.parse(row.original);
      const date = format(task.dueDate, "dd/MM/yyyy");
      return <div>{date}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = userTaskSchema.parse(row.original);
      return <TableRowActions projectId={task.projectId} row={row} />;
    },
  },
];
