"use client";

import { useRouter } from "next/navigation";
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

import { statuses, priorities, labels } from "@/lib/config";
import { userTaskSchema } from "@/lib/schema/TaskSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TableRowActions<TData> {
  row: Row<TData>;
  projectId: string;
}

export default function TableRowActions<TData>({
  row,
  projectId,
}: TableRowActions<TData>) {
  const queryClient = useQueryClient();
  const task = userTaskSchema.parse(row.original);

  const {
    mutate: changeLabel,
    isPending: labelIsPending,
    error: labelChangeError,
  } = useMutation({
    mutationFn: async (label: string) => {
      const options = {
        method: "PUT",
        body: JSON.stringify(label),
      };
      const response = await fetch(
        `/api/projects/${projectId}/tasks/${task.id}/update-label`,
        options
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    mutate: changeStatus,
    isPending: statusIsPending,
    error: statusChangeError,
  } = useMutation({
    mutationFn: async (status: string) => {
      const options = {
        method: "PUT",
        body: JSON.stringify(status),
      };
      const response = await fetch(
        `/api/projects/${projectId}/tasks/${task.id}/update-status`,
        options
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    mutate: changePriority,
    isPending: priorityIsPending,
    error: priorityChangeError,
  } = useMutation({
    mutationFn: async (priority: string) => {
      const options = {
        method: "PUT",
        body: JSON.stringify(priority),
      };
      const response = await fetch(
        `/api/projects/${projectId}/tasks/${task.id}/update-priority`,
        options
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    mutate: deleteTask,
    isPending: deleteIsPending,
    error: deleteTaskError,
  } = useMutation({
    mutationFn: async () => {
      const options = {
        method: "DELETE",
      };
      const response = await fetch(
        `/api/projects/${projectId}/tasks/${task.id}`,
        options
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleLabelChange = async (label: string) => {
    changeLabel(label);
  };

  const handleStatusChange = async (status: string) => {
    changeStatus(status);
  };

  const handlePriorityChange = async (priority: string) => {
    changePriority(priority);
  };

  const taskDelete = async () => {
    deleteTask();
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
          <DropdownMenuItem>Edit</DropdownMenuItem>
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
          <DropdownMenuItem>
            <button
              onClick={() => taskDelete()}
              className="flex items-center cursor-pointer">
              <TrashIcon className="text-red-500 mr-1 w-4 h-4" />
              Delete
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
