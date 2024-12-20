"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import {
  projectMembershipRequest,
  ProjectMembershipRequest,
} from "@/lib/schema/MembershipRequests";
import TableColumnHeader from "./table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TableRowActions from "./table-row-actions";
import { format } from "date-fns";
import { membershipRequestStatuses } from "@/lib/config";

interface TableColumnsProps {
  projectId: string;
}

export const TableColumns = ({
  projectId,
}: TableColumnsProps): ColumnDef<ProjectMembershipRequest>[] => [
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
    id: "name",
    header: () => <TableColumnHeader name="Name" />,
    accessorFn: (row) => row.user.name, // Use accessorFn to access nested property
    cell: ({ row }) => {
      const requester = projectMembershipRequest.parse(row.original);
      const userName = requester.user.name;
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-9 w-9">
            <AvatarImage
              alt="user-image"
              src={requester.user.image ? requester.user.image : ""}
            />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
          <span>{userName}</span>
        </div>
      );
    },
  },
  {
    id: "email",
    accessorFn: (row) => row.user.email,
    header: () => <TableColumnHeader name="Email" />,
    cell: ({ row }) => {
      const requester = projectMembershipRequest.parse(row.original);
      const email = requester.user.email;
      return <div>{email}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <TableColumnHeader name="Request Status" />,
    cell: ({ row }) => {
      const status = membershipRequestStatuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex items-center">
          {status.value === "APPROVED" ? (
            <status.icon className="mr-2 h-5 w-5 text-green-600" />
          ) : status.value === "PENDING" ? (
            <status.icon className="mr-2 h-5 w-5 text-orange-600" />
          ) : status.value === "REJECTED" ? (
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
    accessorKey: "request-date",
    header: () => <TableColumnHeader name="Request Date" />,
    cell: ({ row }) => {
      const requestDate = format(row.original.createdAt, "MMM d, yyyy");
      return <div>{requestDate}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TableRowActions projectId={projectId} row={row} />,
  },
];
