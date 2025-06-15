"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { labels, priorities, statuses } from "@/lib/config";
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
import { useTransition } from "react";
import { deleteTask } from "@/server/actions/project/tasks";
import { toast } from "sonner";
import type { DetailedProject, ProjectTask } from "@/server/database/schema";
import { tryCatch } from "@/lib/try-catch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarIcon,
  ClockIcon,
  EditIcon,
  FlagIcon,
  TagIcon,
  TimerIcon,
  TrashIcon,
  UserIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClipboardListIcon,
  ArrowLeftIcon,
} from "lucide-react";

type Props = {
  project: DetailedProject;
  task: ProjectTask;
};

export default function TaskContent({ project, task }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const label = labels.find((l) => l.value === task.label);
  const status = statuses.find((s) => s.value === task.status);
  const priority = priorities.find((p) => p.value === task.priority);

  const taskCreatedAt = format(task.createdAt, "dd MMM, yyyy • hh:mm a");
  const taskUpdatedAt = task.updatedAt
    ? format(task.updatedAt, "dd MMM, yyyy • hh:mm a")
    : null;
  const taskDueDate = format(task.dueDate, "dd MMM, yyyy");

  const handleTaskDelete = (projectId: number, taskId: number) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(deleteTask(projectId, taskId));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.success) {
        toast.success("Task deleted successfully!");
        router.push(`/projects/${projectId}/tasks/`);
      }
    });
  };

  // Helper functions for styling
  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "DONE":
        return "bg-green-100 text-green-800 border-green-300";
      case "TO_DO":
        return "bg-slate-100 text-slate-800 border-slate-300";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "CANCELED":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityColor = (priorityValue: string) => {
    switch (priorityValue) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-300";
      case "MEDIUM":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getLabelColor = (labelValue: string) => {
    switch (labelValue) {
      case "FEATURE":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "DOCUMENTATION":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "BUG":
        return "bg-red-100 text-red-800 border-red-300";
      case "ERROR":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case "DONE":
        return <CheckCircleIcon className="h-4 w-4 mr-1" />;
      case "TO_DO":
        return <ClipboardListIcon className="h-4 w-4 mr-1" />;
      case "IN_PROGRESS":
        return <ClockIcon className="h-4 w-4 mr-1" />;
      case "CANCELED":
        return <AlertCircleIcon className="h-4 w-4 mr-1" />;
      default:
        return null;
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
                    <DropdownMenuItem className="sm:hidden">
                      <Link href={`/projects/${project.id}/tasks`}>Tasks</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/projects/${project.id}/tasks`}>
                  Tasks
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{task.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => router.push(`/projects/${project.id}/tasks`)}>
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Tasks</span>
                </Button>
                <Badge variant="outline" className={getLabelColor(task.label)}>
                  <TagIcon className="h-3.5 w-3.5 mr-1" />
                  {label?.label}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {task.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                Task in project:{" "}
                <Link
                  href={`/projects/${project.id}`}
                  className="hover:underline font-medium">
                  {project.name}
                </Link>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/projects/${project.id}/tasks/${task.id}/edit`}>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 w-full">
                      <EditIcon className="h-4 w-4" />
                      Edit Task
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Edit this task</TooltipContent>
              </Tooltip>

              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex items-center gap-2 w-full sm:w-auto">
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Delete this task</TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this task?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the task and remove it from the project.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleTaskDelete(project.id, task.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      {isPending ? "Deleting..." : "Delete Task"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardListIcon className="h-5 w-5 text-muted-foreground" />
                  Task Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: task.description }}
                />
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Badge
                      className={`${getStatusColor(
                        task.status
                      )} flex items-center`}>
                      {getStatusIcon(task.status)}
                      {status?.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Badge
                      className={`${getPriorityColor(
                        task.priority
                      )} flex items-center`}>
                      <FlagIcon className="h-3.5 w-3.5 mr-1" />
                      {priority?.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={task.member?.user.image || ""}
                        alt={task.member?.user.name || "Unassigned"}
                      />
                      <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {task.member?.user.name || "Unassigned"}
                      </p>
                      {task.member?.user.email && (
                        <p className="text-xs text-muted-foreground">
                          {task.member.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium mr-1">Created:</span>
                    <span>{taskCreatedAt}</span>
                  </div>

                  {taskUpdatedAt && (
                    <div className="flex items-center text-sm">
                      <ClockIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium mr-1">Updated:</span>
                      <span>{taskUpdatedAt}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm">
                    <TimerIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium mr-1">Due:</span>
                    <span>{taskDueDate}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}
