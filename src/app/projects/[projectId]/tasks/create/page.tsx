"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import format from "date-fns/format";
import {
  LuCheck,
  LuChevronsUpDown,
  LuCalendar,
  LuChevronLeft,
} from "react-icons/lu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskFormValues, taskFormSchema } from "@/lib/schema/TaskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member } from "@/lib/schema/MemberSchema";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { membersData } from "../../components/members";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface CreateTaskPageProps {
  params: {
    projectId: string;
  };
}

export default function CreateTaskPage({ params }: CreateTaskPageProps) {
  const { projectId } = params;
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    mutate: addTask,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (values: TaskFormValues) => {
      const options = {
        method: "POST",
        body: JSON.stringify(values),
      };
      const response = await fetch(`/api/projects/${projectId}/tasks`, options);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
      router.push(`/projects/${projectId}/tasks`);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const members = membersData
    ?.map((member) => ({
      ...member,
      createdAt: new Date(member.createdAt),
      updatedAt: new Date(member.updatedAt),
      tasks: member.tasks.map((task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      })),
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Member[];

  async function onSubmit(values: TaskFormValues) {
    addTask(values);
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:ml-[260px] max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">Create New Task</div>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => router.push(`/projects/${projectId}/tasks`)}>
          <LuChevronLeft className="w-4 h-4" />
          <span>Go back</span>
        </Button>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                      placeholder="Enter task name"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Label</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      required>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select label" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FEATURE">Feature</SelectItem>
                        <SelectItem value="DOCUMENTATION">
                          Documentation
                        </SelectItem>
                        <SelectItem value="BUG">Bug</SelectItem>
                        <SelectItem value="ERROR">Error</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          <SelectValue placeholder="Select priority" />
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

              <FormField
                control={form.control}
                name="dueDate"
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
                            <LuCalendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
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
                                )?.user.name
                              : "Select member"}
                            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search member" />
                          <CommandEmpty>No member found.</CommandEmpty>
                          <CommandGroup>
                            <ScrollArea className="h-[200px]">
                              {members.map((member) => (
                                <CommandItem
                                  value={member.user.name}
                                  key={member.id}
                                  onSelect={() => {
                                    form.setValue("memberId", member.id);
                                  }}>
                                  <LuCheck
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      member.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {member.user.name}
                                </CommandItem>
                              ))}
                            </ScrollArea>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/projects/${projectId}/tasks`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </main>
  );
}