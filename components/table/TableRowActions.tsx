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

import { statuses, priorities } from "@/lib/taskConfig";
import { taskSchema } from "@/lib/schema";
import DeleteTaskModal from "../DeleteTaskModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface TableRowActions<TData> {
  row: Row<TData>;
}

export default function TableRowActions<TData>({
  row,
}: TableRowActions<TData>) {
  const queryClient = useQueryClient();
  const task = taskSchema.parse(row.original);

  const {
    mutate: deleteTask,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      const options = {
        method: "DELETE",
      };
      const response = await fetch(`/api/tasks/${task.id}/delete`, options);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const {
    mutate: changePriority,
    isPending: isPriorityLoading,
    error: priorityChangeError,
  } = useMutation({
    mutationFn: async (priorityValue: string) => {
      const options = {
        method: "PUT",
        body: JSON.stringify(priorityValue),
      };
      const response = await fetch(
        `/api/tasks/${task.id}/update-priority`,
        options
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const taskDelete = async () => {
    deleteTask();
  };

  const handlePriorityChange = async (priorityValue: string) => {
    changePriority(priorityValue);
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
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={task.status}>
                {statuses.map((status) => (
                  <DropdownMenuRadioItem
                    key={status.value}
                    value={status.value}>
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
