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
  CommandList,
} from "@/components/ui/command";
import {
  ProjectTask,
  TaskFormValues,
  taskFormSchema,
} from "@/lib/schema/TaskSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Editor from "./editor";
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
import ProjectNotFound from "../../../../components/project-not-found";
import TaskNotFound from "../../components/task-not-found";
import { useUpdateProjectTaskMutation } from "@/hooks/useProjectQueries";
import { useProjectStore } from "../../../../hooks/useProjectStore";
import JoinProjectModal from "../../../../components/join-project-modal";
import { useTaskStore } from "../../../../hooks/useTaskStore";
import { Label, Priority } from "@/lib/config";

type Props = {
  projectId: string;
  taskId: string;
};

export default function EditTaskForm({ projectId, taskId }: Props) {
  const router = useRouter();

  const project = useProjectStore((state) => state.project);
  const task = useTaskStore((state) => state.task);

  const {
    mutate: updateTask,
    isPending,
    error,
  } = useUpdateProjectTaskMutation(projectId, task);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    values: {
      name: task?.name || "",
      label: (task?.label as Label) || "",
      priority: (task?.priority as Priority) || "",
      dueDate: task?.dueDate ? new Date(task.dueDate) : new Date(),
      memberId: task?.memberId || "",
      description: task?.description || "",
    },
  });

  if (!project) {
    return <ProjectNotFound />;
  }

  if (!task) {
    return <TaskNotFound projectId={projectId} />;
  }

  const isPrivateProject = !project.isPublic;
  const isNotMember = !project.member;

  if (isPrivateProject && isNotMember) {
    return <JoinProjectModal projectId={projectId} />;
  }

  async function onSubmit(values: TaskFormValues) {
    updateTask(values, {
      onSuccess: () => {
        form.reset();
        toast.success("Task updated successfully!");
        router.push(`/projects/${projectId}/tasks/${taskId}`);
      },
      onError: (error) => {
        toast.error("Failed to update task!");
        console.error("Failed to update task:", error);
      },
    });
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
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
                      <Link href={`/projects/${projectId}`}>
                        {project.name}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/projects/${projectId}`}>
                        {project.name}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/projects/${projectId}/tasks`}>Tasks</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href={`/projects/${projectId}/tasks/${task.id}`}>
                  {task.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>edit</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">Update Task</div>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() =>
              router.push(`/projects/${projectId}/tasks/${task.id}`)
            }>
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
                            <CommandList>
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
                            </CommandList>
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
                      <Editor
                        initialContent={field.value}
                        onChange={field.onChange}
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
                  onClick={() =>
                    router.push(`/projects/${projectId}/tasks/${task.id}`)
                  }>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Task"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </main>
    </>
  );
}
