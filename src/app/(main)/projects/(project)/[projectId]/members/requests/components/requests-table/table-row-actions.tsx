"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MembershipRequestStatus,
  membershipRequestStatuses,
} from "@/lib/config";
import { projectMembershipRequest } from "@/lib/schema/MembershipRequests";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";

interface TableRowActions<TData> {
  row: Row<TData>;
  projectId: string;
}

export default function TableRowActions<TData>({
  row,
  projectId,
}: TableRowActions<TData>) {
  const queryClient = useQueryClient();
  const request = projectMembershipRequest.parse(row.original);

  const {
    mutate: updateStatus,
    isPending: statusIsPending,
    error: statusChangeError,
  } = useMutation({
    mutationFn: async (status: string) => {
      const options = {
        method: "PATCH",
        body: JSON.stringify({ status }),
      };
      const response = await fetch(
        `/api/projects/${projectId}/membership-requests/${request.id}`,
        options
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating task status");
      }
    },
    onSuccess: () => {
      toast.success("Task status updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["project-tasks", projectId],
      });
    },
    onError: (error) => {
      toast.error("Failed to updated task status");
      console.log(error);
    },
  });

  const handleStatusChange = async (status: MembershipRequestStatus) => {
    updateStatus(status);
  };

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
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Label</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={request.status}>
                {membershipRequestStatuses.map((status) => (
                  <DropdownMenuRadioItem
                    onClick={() => handleStatusChange(status.value)}
                    key={status.value}
                    value={status.value}>
                    {status.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
