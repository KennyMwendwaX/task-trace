"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AiOutlinePlus } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import format from "date-fns/format";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, taskSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";

const users = [
  { name: "Erick", value: "en" },
  { name: "Francis", value: "fr" },
  { name: "Gilbert", value: "de" },
  { name: "Sandy", value: "es" },
  { name: "Patricia", value: "pt" },
  { name: "Randy", value: "ru" },
  { name: "Jones", value: "ja" },
  { name: "Karen", value: "ko" },
  { name: "Carl", value: "zh" },
] as const;

export default function Modal() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Task>({
    resolver: zodResolver(taskSchema),
  });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [openAssignTask, setOpenAssignTask] = useState(false);
  const queryClient = useQueryClient();

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  const {
    mutate: addTask,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (values: Task) => {
      const options = {
        method: "POST",
        body: JSON.stringify(values),
      };
      const response = await fetch("/api/", options);
      // if (!response.ok) {
      //   throw new Error("Something went wrong");
      // }
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

  async function onSubmit(values: Task) {
    console.log(values);
    // addTask(values);
    // toggleDialog();
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
        <DialogTrigger asChild>
          <Button className="flex items-center space-x-2 rounded-3xl">
            <AiOutlinePlus className="w-4 h-4 text-white" />
            <span>New Task</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription> */}

            <form
              className="space-y-3 pt-4 px-3"
              onSubmit={handleSubmit(onSubmit)}>
              <div className="relative">
                <Label htmlFor="name">Task Name</Label>
                <Input
                  type="text"
                  id="name"
                  className="focus:border-2 focus:border-blue-600"
                  placeholder="Task name"
                  required
                  {...register("name")}
                />
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative">
                  <Label htmlFor="label">Task Name</Label>
                  <Input
                    type="text"
                    id="label"
                    className="focus:border-2 focus:border-blue-600"
                    placeholder="Task label"
                    required
                    {...register("label")}
                  />
                </div>

                <div className="relative">
                  <Label htmlFor="priority">Task Priority</Label>
                  <Select required {...register("priority")}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative flex flex-col space-y-1">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}>
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date <= new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="relative flex flex-col space-y-1">
                  <Label htmlFor="assigned_to">Assign Task</Label>
                  <Popover
                    open={openAssignTask}
                    onOpenChange={setOpenAssignTask}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !selectedUser && "text-muted-foreground"
                        )}>
                        {selectedUser
                          ? users.find((user) => user.value === selectedUser)
                              ?.name
                          : "Select name"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search name" />
                        <CommandEmpty>No user found.</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              value={user.name}
                              key={user.value}
                              onSelect={() => {
                                setSelectedUser((prevUser) =>
                                  prevUser === user.value ? null : user.value
                                );
                                setOpenAssignTask(false);
                              }}>
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedUser === user.value
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
                </div>
              </div>

              <div>
                <div className="relative">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    className="focus:border-2 focus:border-blue-600"
                    placeholder="Task description"
                    required
                    {...register("description")}
                  />
                </div>
              </div>

              <Button type="submit">Save Task</Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
