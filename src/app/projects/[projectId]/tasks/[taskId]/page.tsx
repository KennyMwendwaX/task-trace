"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import { LuCalendar, LuChevronLeft, LuTimer, LuUser2 } from "react-icons/lu";
import { MdAccessTime, MdOutlineFolderOff } from "react-icons/md";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { labels, priorities, statuses } from "@/lib/config";
import Link from "next/link";
import { fetchProject } from "@/lib/api/projects";
import { fetchTask } from "@/lib/api/tasks";
import { BsListTask } from "react-icons/bs";
import Loading from "./components/loading";

const rehypePlugins = [rehypeSanitize, rehypeStringify, rehypeHighlight];

interface StatusConfig {
  bg: string;
  text: string;
}

interface PriorityConfig {
  bg: string;
  text: string;
}

interface LabelConfig {
  border: string;
  text: string;
}

const TaskStatusBadge: React.FC<{
  status: { value: string; label: string };
}> = ({ status }) => {
  const statusConfig: Record<string, StatusConfig> = {
    DONE: { bg: "bg-green-100", text: "text-green-700" },
    TO_DO: { bg: "bg-blue-100", text: "text-blue-700" },
    IN_PROGRESS: { bg: "bg-amber-100", text: "text-amber-700" },
    CANCELED: { bg: "bg-red-100", text: "text-red-700" },
  };

  const { bg, text } = statusConfig[status.value] || {};

  return (
    <span
      className={`${bg} ${text} text-sm font-medium me-2 px-2.5 py-0.5 rounded-md`}>
      {status.label}
    </span>
  );
};

const TaskPriorityBadge: React.FC<{
  priority: { value: string; label: string; icon: React.ElementType };
}> = ({ priority }) => {
  const priorityConfig: Record<string, PriorityConfig> = {
    HIGH: { bg: "bg-red-100", text: "text-red-700" },
    MEDIUM: { bg: "bg-amber-100", text: "text-amber-700" },
    LOW: { bg: "bg-gray-100", text: "text-gray-700" },
  };

  const { bg, text } = priorityConfig[priority.value] || {};

  return (
    <span
      className={`flex items-center space-x-1 ${bg} ${text} text-sm font-medium me-2 px-2.5 py-0.5 rounded-md`}>
      <priority.icon />
      {priority.label}
    </span>
  );
};

const TaskLabelBadge: React.FC<{ label: { value: string; label: string } }> = ({
  label,
}) => {
  const labelConfig: Record<string, LabelConfig> = {
    FEATURE: { border: "border-blue-600", text: "text-blue-600" },
    DOCUMENTATION: { border: "border-purple-600", text: "text-purple-600" },
    BUG: { border: "border-amber-600", text: "text-amber-600" },
    ERROR: { border: "border-red-600", text: "text-red-600" },
  };

  const { border, text } = labelConfig[label.value] || {};

  return (
    <Badge className={`${border} ${text}`} variant="outline">
      {label.label}
    </Badge>
  );
};

interface TaskPageProps {
  params: {
    projectId: string;
    taskId: string;
  };
}

export default function TaskPage({ params }: TaskPageProps) {
  const { projectId, taskId } = params;
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: project,
    isLoading: projectIsLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });

  const {
    data: task,
    isLoading: taskIsLoading,
    error: taskError,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTask(projectId, taskId),
    enabled: !!projectId && !!taskId,
  });

  const { mutate: deleteTask } = useMutation({
    mutationFn: async () => {
      if (!task) return;
      const response = await fetch(
        `/api/projects/${projectId}/tasks/${task.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Something went wrong");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      router.push(`/projects/${projectId}/tasks`);
    },
    onError: (error) => console.log(error),
  });

  if (projectIsLoading || taskIsLoading) {
    return (
      <main className="flex flex-1 flex-col gap-2 p-4 lg:pt-4 lg:ml-[260px]">
        <Loading />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex flex-1 flex-col gap-2 p-4 lg:pt-4 lg:ml-[260px]">
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[560px]">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
              <MdOutlineFolderOff className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              No Project Found
            </h2>
            <p className="text-gray-600 mb-4">
              The project you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                variant="default"
                className="flex items-center justify-center gap-2 rounded-full"
                onClick={() => router.push("/dashboard")}>
                <LuChevronLeft className="w-5 h-5" />
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="flex flex-1 flex-col gap-2 p-4 lg:pt-4 lg:ml-[260px]">
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[560px]">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
              <BsListTask className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              No Task Found
            </h2>
            <p className="text-gray-600 mb-4">
              The task you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                variant="default"
                className="flex items-center justify-center gap-2 rounded-full"
                onClick={() => router.push(`/projects/${projectId}/tasks`)}>
                <LuChevronLeft className="w-5 h-5" />
                Go Back to Tasks
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const label = labels.find((l) => l.value === task.label);
  const status = statuses.find((s) => s.value === task.status);
  const priority = priorities.find((p) => p.value === task.priority);

  const taskCreatedAt = format(task.createdAt, "dd MMM, yyyy • hh:mm a");
  const taskUpdatedAt = task.updatedAt
    ? format(task.updatedAt, "dd MMM, yyyy • hh:mm a")
    : null;
  const taskDueDate = format(task.dueDate, "dd MMM, yyyy");

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:ml-[260px] max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold mb-2">{task.name}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            {label && <TaskLabelBadge label={label} />}
            {status && <TaskStatusBadge status={status} />}
            {priority && <TaskPriorityBadge priority={priority} />}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link href={`/projects/${projectId}/tasks/${taskId}/edit`}>
            <Button
              variant="outline"
              className="flex items-center gap-1 w-full">
              <FiEdit />
              Edit Task
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="flex items-center justify-center w-full sm:w-auto"
            onClick={() => deleteTask()}>
            <FiTrash className="mr-2" />
            Delete Task
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 lg:flex-wrap-reverse">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
            <MdAccessTime className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm font-semibold text-gray-800">
              Created: {taskCreatedAt}
            </span>
          </div>
          {taskUpdatedAt && (
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
              <LuCalendar className="w-4 h-4 text-gray-600 mr-2" />
              <span className="text-sm font-semibold text-gray-800">
                Updated: {taskUpdatedAt}
              </span>
            </div>
          )}
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
            <LuTimer className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm font-semibold text-gray-800">
              Due: {taskDueDate}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
          <Avatar className="w-10 h-10 bg-white">
            <AvatarImage src={""} />
            <AvatarFallback className="bg-white">
              <LuUser2 className="w-5 h-5 text-gray-600" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-gray-500">Assigned to</p>
            <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
              Emirril Lagasee
            </p>
          </div>
        </div>
      </div>
      <Card className="mt-4 p-4 sm:p-6">
        <MarkdownPreview
          className="bg-gray-50 p-4 rounded-md"
          source={task.description}
          rehypePlugins={rehypePlugins}
          wrapperElement={{ "data-color-mode": "light" }}
        />
      </Card>
    </main>
  );
}
