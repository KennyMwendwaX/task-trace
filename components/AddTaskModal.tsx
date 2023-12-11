"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

export default function AddTaskModal() {
  const form = useForm<Task>({
    // resolver: zodResolver(taskSchema),
    // defaultValues: {
    //   name: "",
    //   label: "",
    //   priority: "",
    //   due_date: new Date(Date.now()),
    //   assignedTo: "",
    //   description: "",
    // },
  });
  const [isDialogOpen, setDialogOpen] = useState(false);
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
      const response = await fetch("/api/tasks", options);
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

  async function onSubmit(values: Task) {
    console.log(values);
    addTask(values);
    toggleDialog();
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

            <Form {...form}>
              <form
                className="space-y-3 pt-4 px-3"
                onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          id="name"
                          className="focus:border-2 focus:border-blue-600"
                          placeholder="Task name"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 md:gap-6">
                  <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Label</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id="label"
                            className="focus:border-2 focus:border-blue-600"
                            placeholder="Task label"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="relative">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task Priority</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            required>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="LOW">Low</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HIGH">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="relative">
                    {/* Use flex to align label and popover content */}
                    <FormField
                      control={form.control}
                      name="due_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}>
                                  {field.value ? (
                                    format(new Date(field.value), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start">
                              <Calendar
                                mode="single"
                                selected={new Date(field.value)}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={(date) => date <= new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Assign Task</FormLabel>
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
                                      (user) => user.value === field.value
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
                                    key={user.value}
                                    onSelect={() => {
                                      form.setValue("assignedTo", user.value);
                                    }}>
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        user.value === field.value
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
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            id="description"
                            className="focus:border-2 focus:border-blue-600"
                            placeholder="Task description"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Save Task</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
