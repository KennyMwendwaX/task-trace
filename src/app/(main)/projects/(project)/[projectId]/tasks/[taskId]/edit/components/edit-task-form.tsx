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
import { format } from "date-fns/format";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { type TaskFormValues, taskFormSchema } from "@/lib/schema/TaskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { updateTask } from "@/server/api/project/tasks";
import type {
  DetailedProject,
  ProjectMember,
  ProjectTask,
} from "@/database/schema";
import { useTransition } from "react";
import { tryCatch } from "@/lib/try-catch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarIcon,
  ChevronLeftIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  ClockIcon,
  TagIcon,
  UserIcon,
  FlagIcon,
  ListTodoIcon,
  SaveIcon,
  XIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TaskDescriptionEditor } from "../../../components/task-description-editor";

type Props = {
  project: DetailedProject;
  task: ProjectTask;
  members: ProjectMember[];
};

export default function EditTaskForm({ project, task, members }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    values: {
      name: task.name,
      label: task.label,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      memberId: task.memberId?.toString() ?? null,
      description: task.description,
    },
  });

  const onSubmit = (values: TaskFormValues) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        updateTask(project.id, task.id, values)
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.success === true) {
        form.reset();
        toast.success("Task updated successfully!");
        router.push(`/projects/${project.id}/tasks/${task.id}`);
      }
    });
  };

  // Helper function to get label color
  const getLabelColor = (label: string) => {
    switch (label) {
      case "FEATURE":
        return "bg-emerald-100 text-emerald-800";
      case "DOCUMENTATION":
        return "bg-blue-100 text-blue-800";
      case "BUG":
        return "bg-red-100 text-red-800";
      case "ERROR":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-amber-100 text-amber-800";
      case "HIGH":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "TO_DO":
        return "bg-slate-100 text-slate-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "DONE":
        return "bg-green-100 text-green-800";
      case "CANCELED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <TooltipProvider>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>
                      <Link href="/projects">Projects</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/projects/${project.id}`}>
                        {project.name}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/projects/${project.id}/tasks`}>Tasks</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="sm:hidden">
                      <Link href={`/projects/${project.id}/tasks/${task.name}`}>
                        {task.name}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href={`/projects/${project.id}/tasks/${task.id}`}>
                  {task.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Task</h1>
            <p className="text-muted-foreground mt-1">
              Editing task: <span className="font-medium">{task.name}</span>
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
                onClick={() =>
                  router.push(`/projects/${project.id}/tasks/${task.id}`)
                }>
                <ChevronLeftIcon className="w-4 h-4" />
                <span>Back to Task</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Return to task details</TooltipContent>
          </Tooltip>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-6"
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
                          className="focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="Enter a descriptive task name"
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
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4 text-muted-foreground" />
                          Due Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}>
                                {field.value && field.value instanceof Date ? (
                                  format(field.value, "PPP")
                                ) : field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
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
                        <FormLabel className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                          Assign To
                        </FormLabel>
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
                                      (member) =>
                                        member.id.toString() === field.value
                                    )?.user.name
                                  : "Select team member"}
                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[250px] p-0">
                            <Command>
                              <CommandInput placeholder="Search team members..." />
                              <CommandEmpty>No member found.</CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  <ScrollArea className="h-[200px]">
                                    {members.map((member) => (
                                      <CommandItem
                                        value={member.user.name}
                                        key={member.id}
                                        onSelect={() => {
                                          form.setValue(
                                            "memberId",
                                            member.id.toString()
                                          );
                                        }}>
                                        <CheckIcon
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            member.id.toString() === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {member.user.name}
                                      </CommandItem>
                                    ))}
                                  </ScrollArea>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <TagIcon className="h-4 w-4 text-muted-foreground" />
                          Task Label
                        </FormLabel>
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
                            <SelectItem value="FEATURE">
                              <div className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "mr-2",
                                    getLabelColor("FEATURE")
                                  )}>
                                  Feature
                                </Badge>
                                <span>Feature</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="DOCUMENTATION">
                              <div className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "mr-2",
                                    getLabelColor("DOCUMENTATION")
                                  )}>
                                  Docs
                                </Badge>
                                <span>Documentation</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="BUG">
                              <div className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className={cn("mr-2", getLabelColor("BUG"))}>
                                  Bug
                                </Badge>
                                <span>Bug</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="ERROR">
                              <div className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "mr-2",
                                    getLabelColor("ERROR")
                                  )}>
                                  Error
                                </Badge>
                                <span>Error</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <ListTodoIcon className="h-4 w-4 text-muted-foreground" />
                          Status
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          required>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="TO_DO">
                              <div className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "mr-2",
                                    getStatusColor("TO_DO")
                                  )}>
                                  Todo
                                </Badge>
                                <span>Todo</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              <div className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "mr-2",
                                    getStatusColor("IN_PROGRESS")
                                  )}>
                                  In Progress
                                </Badge>
                                <span>In Progress</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="DONE">
                              <div className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "mr-2",
                                    getStatusColor("DONE")
                                  )}>
                                  Done
                                </Badge>
                                <span>Done</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="CANCELED">
                              <div className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "mr-2",
                                    getStatusColor("CANCELED")
                                  )}>
                                  Canceled
                                </Badge>
                                <span>Canceled</span>
                              </div>
                            </SelectItem>
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
                        <FormLabel className="flex items-center gap-2">
                          <FlagIcon className="h-4 w-4 text-muted-foreground" />
                          Priority
                        </FormLabel>
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
                            <SelectItem value="LOW">
                              <div className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "mr-2",
                                    getPriorityColor("LOW")
                                  )}>
                                  Low
                                </Badge>
                                <span>Low</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="MEDIUM">
                              <div className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "mr-2",
                                    getPriorityColor("MEDIUM")
                                  )}>
                                  Medium
                                </Badge>
                                <span>Medium</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="HIGH">
                              <div className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "mr-2",
                                    getPriorityColor("HIGH")
                                  )}>
                                  High
                                </Badge>
                                <span>High</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel className="flex items-center gap-2">
                        Description
                      </FormLabel>
                      <FormControl>
                        <TaskDescriptionEditor
                          onChange={field.onChange}
                          placeholder="Provide a detailed description of the task..."
                          initialContent={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/projects/${project.id}/tasks/${task.id}`
                          )
                        }
                        className="flex items-center gap-2">
                        <XIcon className="h-4 w-4" />
                        Cancel
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Discard changes and return to task
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2">
                        {isPending ? (
                          <>
                            <LoaderCircleIcon className="-ml-1 mr-2 h-4 w-4 animate-spin text-background" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <SaveIcon className="h-4 w-4" />
                            Update Task
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save changes to this task</TooltipContent>
                  </Tooltip>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </TooltipProvider>
  );
}
