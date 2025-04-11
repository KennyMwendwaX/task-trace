"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { Member, memberSchema } from "@/lib/schema/MemberSchema";
import TableColumnHeader from "./table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TableRowActions from "./table-row-actions";
import { format } from "date-fns";

interface TableColumnsProps {
  projectId: number;
}

export const TableColumns = ({
  projectId,
}: TableColumnsProps): ColumnDef<Member>[] => [
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
      const member = row.original;
      const memberName = member.user.name;
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-9 w-9">
            <AvatarImage
              alt="user-image"
              src={member.user.image ? member.user.image : ""}
            />
            <AvatarFallback>{memberName[0]}</AvatarFallback>
          </Avatar>
          <span className="hover:underline cursor-pointer">{memberName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => <TableColumnHeader name="Email" />,
    cell: ({ row }) => {
      const member = row.original;
      const email = member.user.email;
      return <div>{email}</div>;
    },
  },
  {
    accessorKey: "role",
    header: () => <TableColumnHeader name="Role" />,
    cell: ({ row }) => {
      const member = row.original;
      const role = member.role;
      return <div>{role}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <TableColumnHeader name="Joined At" />,
    cell: ({ row }) => {
      const member = row.original;
      const joinedAt = format(member.createdAt, "MMM d, yyyy");
      return <div>{joinedAt}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TableRowActions projectId={projectId} row={row} />,
  },
];
