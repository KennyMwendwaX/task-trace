"use client";

import { DotsHorizontalIcon, TrashIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  statuses,
  priorities,
  labels,
  Label,
  Status,
  Priority,
} from "@/lib/config";
import { taskSchema } from "@/lib/schema/TaskSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteTask } from "@/server/actions/project/tasks";

interface TableRowActions<TData> {
  row: Row<TData>;
  projectId: string;
}

export default function TableRowActions<TData>({
  row,
  projectId,
}: TableRowActions<TData>) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const router = useRouter();
  const task = taskSchema.parse(row.original);

  const {
    mutate: updateLabel,
    isPending: labelIsPending,
    error: labelChangeError,
  } = useMutation({
    mutationFn: async (label: string) => {
      const options = {
        method: "PATCH",
        body: JSON.stringify({ label }),
      };
      const response = await fetch(
        `/api/projects/${projectId}/tasks/${task.id}/label`,
        options
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating task label");
      }
    },
    onSuccess: () => {
      toast.success("Task label updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["project-tasks", projectId],
      });
    },
    onError: (error) => {
      toast.error("Failed to updated task label");
      console.log(error);
    },
  });

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
        `/api/projects/${projectId}/tasks/${task.id}/status`,
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

  const {
    mutate: updatePriority,
    isPending: priorityIsPending,
    error: priorityChangeError,
  } = useMutation({
    mutationFn: async (priority: string) => {
      const options = {
        method: "PATCH",
        body: JSON.stringify({ priority }),
      };
      const response = await fetch(
        `/api/projects/${projectId}/tasks/${task.id}/priority`,
        options
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating task priority");
      }
    },
    onSuccess: () => {
      toast.success("Task priority updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["project-tasks", projectId],
      });
    },
    onError: (error) => {
      toast.error("Failed to updated task priority");
      console.log(error);
    },
  });

  const handleEditTask = () => {
    router.push(`/projects/${projectId}/tasks/${task.id}/edit`);
  };

  const handleLabelChange = async (label: Label) => {
    updateLabel(label);
  };

  const handleStatusChange = async (status: Status) => {
    updateStatus(status);
  };

  const handlePriorityChange = async (priority: Priority) => {
    updatePriority(priority);
  };

  const handleTaskDelete = (projectId: string, taskId: string) => {
    startTransition(async () => {
      const result = await deleteTask(projectId, taskId);

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      if (result.success) {
        toast.success("Task deleted successfully!");
        router.refresh();
      }
    });
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
          <DropdownMenuItem onClick={handleEditTask}>
            <FiEdit className="mr-2 w-4 h-4" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Label</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={task.label}>
                {labels.map((label) => (
                  <DropdownMenuRadioItem
                    onClick={() => handleLabelChange(label.value)}
                    key={label.value}
                    value={label.value}>
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={task.status}>
                {statuses.map((status) => (
                  <DropdownMenuRadioItem
                    onClick={() => handleStatusChange(status.value)}
                    key={status.value}
                    value={status.value}>
                    {status.value === "DONE" ? (
                      <status.icon className="mr-2 h-5 w-5 text-green-600" />
                    ) : status.value === "TO_DO" ? (
                      <status.icon className="mr-2 h-5 w-5 text-blue-600" />
                    ) : status.value === "IN_PROGRESS" ? (
                      <status.icon className="mr-2 h-5 w-5 text-orange-600" />
                    ) : status.value === "CANCELED" ? (
                      <status.icon className="mr-2 h-5 w-5 text-red-600" />
                    ) : null}
                    {status.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={task.priority}>
                {priorities.map((priority) => (
                  <DropdownMenuRadioItem
                    onClick={() => handlePriorityChange(priority.value)}
                    key={priority.value}
                    value={priority.value}>
                    {priority.value === "HIGH" ? (
                      <priority.icon className="mr-2 h-5 w-5 text-muted-foreground text-red-600" />
                    ) : priority.value === "MEDIUM" ? (
                      <priority.icon className="mr-2 h-5 w-5 text-muted-foreground text-orange-500" />
                    ) : priority.value === "LOW" ? (
                      <priority.icon className="mr-2 h-5 w-5 text-muted-foreground text-blue-600" />
                    ) : null}
                    {priority.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center cursor-pointer"
            onClick={() => handleTaskDelete(projectId, task.id)}>
            <TrashIcon className="text-red-500 mr-2 w-5 h-5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
