"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectMembershipRequest } from "@/database/schema";
import { tryCatch } from "@/lib/try-catch";
import {
  acceptMembershipRequest,
  rejectMembershipRequest,
} from "@/server/api/project/members";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { toast } from "sonner";

interface TableRowActionsProps {
  row: Row<ProjectMembershipRequest>;
}

export default function TableRowActions({ row }: TableRowActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const request = row.original;

  const handleAcceptRequest = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        acceptMembershipRequest(request.id)
      );

      if (error) {
        toast.error(error.message || "Failed to accept request");
        return;
      }

      if (data?.success === true) {
        toast.success("Request accepted successfully!");
        router.refresh();
      }
    });
  };

  const handleRejectRequest = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        rejectMembershipRequest(request.id)
      );

      if (error) {
        toast.error(error.message || "Failed to reject request");
        return;
      }

      if (data?.success === true) {
        toast.success("Request rejected successfully!");
        router.refresh();
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isPending}>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem
          onClick={handleAcceptRequest}
          disabled={isPending}
          className="cursor-pointer">
          <AiOutlineCheck className="mr-2 w-4 h-4 text-green-500" />
          Accept Request
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleRejectRequest}
          disabled={isPending}
          className="cursor-pointer">
          <AiOutlineClose className="mr-2 w-4 h-4 text-red-500" />
          Reject Request
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
