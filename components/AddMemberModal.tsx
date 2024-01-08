"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AiOutlinePlus } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  MemberFormSchema,
  User,
  memberFormSchema,
} from "@/lib/schema/UserSchema";
import {
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddMemberModal() {
  const form = useForm<MemberFormSchema>({
    resolver: zodResolver(memberFormSchema),
  });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get("/api/users");
      return data.users as User[];
    },
  });

  const {
    mutate: addMember,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (values: MemberFormSchema) => {
      const options = {
        method: "POST",
        body: JSON.stringify(values),
      };
      const response = await fetch("/api/projects", options);
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

  const users = usersData || [];
  console.log(users);

  async function onSubmit(values: MemberFormSchema) {
    addMember(values);
    toggleDialog();
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
        <DialogTrigger asChild>
          <Button className="flex items-center space-x-2 rounded-3xl">
            <AiOutlinePlus className="w-4 h-4 text-white" />
            <span>New Member</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Member</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription> */}

            <Form {...form}>
              <form
                className="space-y-3 pt-4 px-3"
                onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-2 md:gap-6">
                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Assign Member</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
                                  !field.value && "text-muted-foreground"
                                )}>
                                {field.value
                                  ? users.find(
                                      (user) => user.id === field.value
                                    )?.name
                                  : "Select name"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search name" />
                              <CommandEmpty>No user found.</CommandEmpty>
                              <CommandGroup>
                                {users.map((user) => (
                                  <CommandItem
                                    value={user.name}
                                    key={user.id}
                                    onSelect={() => {
                                      form.setValue("userId", user.id);
                                    }}>
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        user.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {user.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          required>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select member role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MEMBER">MEMBER</SelectItem>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">Save Member</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
