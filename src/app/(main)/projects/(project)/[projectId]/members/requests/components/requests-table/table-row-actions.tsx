"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectMembershipRequest } from "@/database/schema";
import { MembershipRequestStatus } from "@/lib/config";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";

interface TableRowActions<TData> {
  row: Row<ProjectMembershipRequest>;
  projectId: number;
}

export default function TableRowActions<TData>({
  row,
  projectId,
}: TableRowActions<TData>) {
  const request = row.original;

  const handleAcceptRequest = async (userId: number) => {};

  const handleRejectRequest = async (status: MembershipRequestStatus) => {};

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem
            onClick={() => handleAcceptRequest(request.user.id)}>
            <AiOutlinePlus className="mr-2 w-4 h-4 text-blue-500 " />
            Accept Request
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRejectRequest("REJECTED")}>
            <AiOutlineClose className="mr-2 w-4 h-4 text-red-500 " />
            Cancel Request
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
