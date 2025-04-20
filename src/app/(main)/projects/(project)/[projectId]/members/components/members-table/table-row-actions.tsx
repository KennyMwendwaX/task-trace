"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ProjectMember } from "@/database/schema";
import {
  DotsHorizontalIcon,
  TrashIcon,
  PersonIcon,
  EnvelopeClosedIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";

interface TableRowActions<TData> {
  row: Row<ProjectMember>;
  projectId: number;
  onRoleChange?: (
    memberId: number,
    newRole: "OWNER" | "ADMIN" | "MEMBER"
  ) => void;
  onRemove?: (memberId: number) => void;
  currentUserRole: "OWNER" | "ADMIN" | "MEMBER";
}

export default function TableRowActions<TData>({
  row,
  projectId,
  onRoleChange,
  onRemove,
  currentUserRole = "MEMBER",
}: TableRowActions<TData>) {
  const member = row.original;
  const [role, setRole] = useState<"OWNER" | "ADMIN" | "MEMBER">(member.role);

  const handleRoleChange = (newRole: string) => {
    const typedRole = newRole as "OWNER" | "ADMIN" | "MEMBER";
    setRole(typedRole);

    if (onRoleChange) {
      onRoleChange(member.id, typedRole);
      toast.success(
        `${member.user.name}'s role has been updated to ${typedRole}`
      );
    }
  };

  const handleRemoveUser = (id: number) => {
    if (onRemove) {
      onRemove(id);
    }
  };

  const handleSendInvite = () => {
    toast.success(`A reminder has been sent to ${member.user.email}`);
  };

  const handleViewProfile = () => {
    // Navigate to user profile page or open user details modal
    toast.success(`Viewing ${member.user.name}'s profile`);
  };

  // Determine if current user can change roles
  const canChangeRoles = ["OWNER", "ADMIN"].includes(currentUserRole);
  // OWNER can manage everyone, ADMIN can't manage OWNER
  const canManageMember =
    currentUserRole === "OWNER" ||
    (currentUserRole === "ADMIN" && member.role !== "OWNER");

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
        <DropdownMenuContent align="end" className="w-[200px]">
          {/* Role management dropdown */}
          {canChangeRoles && canManageMember && (
            <>
              <DropdownMenuRadioGroup
                value={role}
                onValueChange={handleRoleChange}>
                <DropdownMenuItem className="p-2 font-medium">
                  Change Role
                </DropdownMenuItem>
                <DropdownMenuRadioItem
                  value="OWNER"
                  disabled={currentUserRole !== "OWNER"}>
                  Owner
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ADMIN">
                  Admin
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="MEMBER">
                  Member
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
            </>
          )}

          {/* View profile */}
          <DropdownMenuItem onSelect={handleViewProfile}>
            <PersonIcon className="mr-2 h-4 w-4" />
            View Profile
          </DropdownMenuItem>

          {/* Send invite/reminder */}
          <DropdownMenuItem onSelect={handleSendInvite}>
            <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
            Send Invite Reminder
          </DropdownMenuItem>

          {/* Direct message */}
          <DropdownMenuItem>
            <PaperPlaneIcon className="mr-2 h-4 w-4" />
            Message
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Remove member */}
          {canManageMember && (
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onSelect={() => handleRemoveUser(member.id)}>
              <TrashIcon className="mr-2 h-4 w-4" />
              Remove Member
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
