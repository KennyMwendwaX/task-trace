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
import { statuses, priorities, labels } from "@/lib/config";
import { IoOpenOutline } from "react-icons/io5";
import { toast } from "sonner";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Task } from "@/database/schema";

interface TableRowActions<TData> {
  row: Row<Task>;
  projectId: number;
}

export default function TableRowActions<TData>({
  row,
  projectId,
}: TableRowActions<TData>) {
  const router = useRouter();
  const task = row.original;

  const handleLabelChange = async (label: string) => {};

  const handleStatusChange = async (status: string) => {};

  const handlePriorityChange = async (priority: string) => {};

  const taskDelete = async () => {};

  const handleEditTask = () => {};

  const handleGoToProject = () => {
    router.push(`/projects/${projectId}`);
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
          <DropdownMenuItem onClick={handleGoToProject}>
            <IoOpenOutline className="mr-2 w-5 h-5" /> Go to Project
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
            onClick={() => taskDelete()}>
            <TrashIcon className="text-red-500 mr-2 w-5 h-5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
