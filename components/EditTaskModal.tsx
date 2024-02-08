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
import { Task, TaskFormValues, taskFormSchema } from "@/lib/schema/TaskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member } from "@/lib/schema/UserSchema";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { ScrollArea } from "./ui/scroll-area";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/navigation";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface Props {
  projectId: string;
  memberId: string;
  members: Member[];
  task: Task;
}

export default function EditTaskModal({
  projectId,
  memberId,
  members,
  task,
}: Props) {
  const router = useRouter();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    values: {
      name: task.name,
      label: task.label,
      priority: task.priority,
      due_date: new Date(task.due_date),
      memberId: memberId,
      description: task.description,
    },
  });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  const {
    mutate: updateTask,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (values: TaskFormValues) => {
      const options = {
        method: "PUT",
        body: JSON.stringify(values),
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
        queryKey: ["task", task.id],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function onSubmit(values: TaskFormValues) {
    updateTask(values);
    toggleDialog();
    router.refresh();
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center w-full">
            <FiEdit className="mr-1" />
            Edit Task
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <ScrollArea className="h-[80vh]">
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
                      name="memberId"
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
                                    ? members.find(
                                        (member) => member.id === field.value
                                      )?.userName
                                    : "Select member"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput placeholder="Search member" />
                                <CommandEmpty>No member found.</CommandEmpty>
                                <CommandGroup>
                                  {members.map((member) => (
                                    <CommandItem
                                      value={member.userName}
                                      key={member.id}
                                      onSelect={() => {
                                        form.setValue("memberId", member.id);
                                      }}>
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          member.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {member.userName}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
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
                            <SimpleMDE
                              id="description"
                              className="focus:border-2 focus:border-blue-600"
                              placeholder="Task description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* <div>
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
                </div> */}
                  <DialogFooter>
                    <Button type="submit">Update Task</Button>
                  </DialogFooter>
                </form>
              </Form>
            </ScrollArea>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
