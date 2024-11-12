"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MembershipRequestStatus } from "@/lib/config";
import { projectMembershipRequest } from "@/lib/schema/MembershipRequests";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { AiOutlinePlus } from "react-icons/ai";
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
  const router = useRouter();
  const request = projectMembershipRequest.parse(row.original);

  const { mutate: addMember } = useMutation({
    mutationFn: async (userId: string) => {
      const options = {
        method: "POST",
        body: JSON.stringify({ userId }),
      };
      const response = await fetch(
        `/api/projects/${projectId}/members`,
        options
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    },
    onSuccess: () => {
      toast.success("Membership request successfully approved");
      router.push(`/project/${projectId}/members`);
      queryClient.invalidateQueries({
        queryKey: ["members", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["membership-requests", projectId],
      });
    },
    onError: (error) => {
      toast.error("Failed to approve membership request");
      console.log(error);
    },
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: async (status: string) => {
      const options = {
        method: "PUT",
        body: JSON.stringify({ status }),
      };
      const response = await fetch(
        `/api/projects/${projectId}/membership-requests/${request.id}`,
        options
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating request status");
      }
    },
    onSuccess: () => {
      toast.success("Membership request rejected");
      queryClient.invalidateQueries({
        queryKey: ["membership-requests", projectId],
      });
    },
    onError: (error) => {
      toast.error("Failed to reject membership request");
      console.log(error);
    },
  });

  const handleAddMember = async (userId: string) => {
    addMember(userId);
  };

  const handleRejectRequest = async (status: MembershipRequestStatus) => {
    rejectRequest(status);
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
          <DropdownMenuItem onClick={() => handleAddMember(request.user.id)}>
            <AiOutlinePlus className="mr-2 w-4 h-4" />
            Add User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRejectRequest("REJECTED")}>
            <AiOutlinePlus className="mr-2 w-4 h-4" />
            Cancel request
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
