"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userSchema } from "@/lib/schema/UserSchema";
import { DotsHorizontalIcon, TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";

interface TableRowActions<TData> {
  row: Row<TData>;
}

export default function TableRowActions<TData>({
  row,
}: TableRowActions<TData>) {
  const queryClient = useQueryClient();
  const user = userSchema.parse(row.original);

  const {
    mutate: removeUser,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (id: string) => {
      const options = {
        method: "DELETE",
      };
      const response = await fetch(`/api/teams/${id}/delete`, options);
      if (!response.ok) throw new Error("Something went wrong");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleRemoveUser = (id: string) => {
    removeUser(id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 data-[state=open]:bg-muted">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>Assign Task</DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button
              onClick={() => handleRemoveUser(user.id)}
              className="flex items-center cursor-pointer">
              <TrashIcon className="text-red-500 mr-1 w-4 h-4" />
              Remove user
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
