"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ProjectMember } from "@/database/schema";
import { ProjectRole } from "@/lib/config";
import {
  DotsHorizontalIcon,
  TrashIcon,
  PersonIcon,
  EnvelopeClosedIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { tryCatch } from "@/lib/try-catch";

interface TableRowActions<TData> {
  row: Row<ProjectMember>;
  projectId: number;
  onRoleChange?: (memberId: number, newRole: ProjectRole) => void;
  onRemove?: (memberId: number) => void;
  currentUserRole: ProjectRole;
}

export default function TableRowActions<TData>({
  row,
  projectId,
  onRoleChange,
  onRemove,
  currentUserRole,
}: TableRowActions<TData>) {
  const [isPending, startTransition] = useTransition();
  const member = row.original;

  const handleRoleChange = (newRole: ProjectRole) => {
    if (onRoleChange) {
      startTransition(() => {
        onRoleChange(member.id, newRole);
        toast.success(
          `${member.user.name}'s role has been updated to ${newRole}`
        );
      });
    }
  };

  const handleRemoveUser = (id: number) => {
    if (onRemove) {
      startTransition(() => {
        onRemove(id);
        toast.success(`${member.user.name} has been removed from the project`);
      });
    }
  };

  const handleSendInvite = () => {
    toast.success(`A reminder has been sent to ${member.user.email}`);
  };

  const handleViewProfile = () => {
    toast.success(`Viewing ${member.user.name}'s profile`);
  };

  // Determine if current user can change roles
  const canChangeRoles = ["OWNER", "ADMIN"].includes(currentUserRole);

  // OWNER can manage everyone, ADMIN can't manage OWNER
  const canManageMember =
    currentUserRole === "OWNER" ||
    (currentUserRole === "ADMIN" && member.role !== "OWNER");

  const roleOptions = [
    { value: "OWNER", label: "Owner" },
    { value: "ADMIN", label: "Admin" },
    { value: "MEMBER", label: "Member" },
  ];

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
          {/* Role management dropdown using SubContent */}
          {canChangeRoles && canManageMember && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={member.role}>
                  {roleOptions.map((role) => (
                    <DropdownMenuRadioItem
                      key={role.value}
                      value={role.value}
                      onClick={() =>
                        handleRoleChange(role.value as ProjectRole)
                      }
                      disabled={
                        isPending ||
                        (role.value === "OWNER" && currentUserRole !== "OWNER")
                      }>
                      {role.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
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
              onSelect={() => handleRemoveUser(member.id)}
              disabled={isPending}>
              <TrashIcon className="mr-2 h-4 w-4" />
              Remove Member
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
