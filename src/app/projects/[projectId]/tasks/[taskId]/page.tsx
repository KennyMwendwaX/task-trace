"use client";

import Loading from "@/components/loading";
import { labels, priorities, statuses } from "@/lib/config";
import { ProjectTask } from "@/lib/schema/TaskSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import format from "date-fns/format";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiTrash } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LuTimer, LuUser2 } from "react-icons/lu";
import { MdAccessTime } from "react-icons/md";
import { Member } from "@/lib/schema/MemberSchema";
import EditTaskModal from "@/components/EditTaskModal";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function TaskPage({
  params,
}: {
  params: { projectId: string; taskId: string };
}) {
  const projectId = params.projectId;
  const taskId = params.taskId;

  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: taskData,
    isLoading: taskIsLoading,
    error,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/projects/${projectId}/tasks/${taskId}`
      );
      return data.task as ProjectTask;
    },
  });

  const task = taskData;

  const {
    data: membersData,
    isLoading: membersIsLoading,
    error: membersError,
  } = useQuery({
    queryKey: ["members", projectId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${projectId}/members`);
      return data.members as Member[];
    },
  });

  const {
    mutate: deleteTask,
    isPending: deletePending,
    error: deleteError,
  } = useMutation({
    mutationFn: async () => {
      if (!task) return;
      const options = {
        method: "DELETE",
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
        queryKey: ["tasks", projectId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const members = membersData || [];

  const isLoading = taskIsLoading || membersIsLoading;

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 lg:ml-[260px]">
        <Loading />
      </main>
    );
  }

  if (!task) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 lg:ml-[260px]">
        <div className="text-2xl font-bold tracking-tight">
          Task was not found
        </div>
      </main>
    );
  }

  const label = labels.find((label) => label.value === task.label);
  const status = statuses.find((status) => status.value === task.status);
  const priority = priorities.find(
    (priority) => priority.value === task.priority
  );
  const taskCreatedAt = format(
    new Date(task.createdAt),
    "dd MMM, yyyy • hh:ss"
  );
  const taskDueDate = format(new Date(task.dueDate), "dd MMM, yyyy");

  // Added a plugin to sanitize the markdown
  const rehypePlugins = [rehypeSanitize, rehypeStringify, rehypeHighlight];

  const taskDelete = async () => {
    deleteTask();
    router.push(`/projects/${projectId}/tasks`);
  };

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 lg:ml-[260px]">
        <div className="flex items-start space-x-4">
          <div className="w-[850px]">
            <div className="flex items-center space-x-2 text-2xl font-bold tracking-tight">
              {label && (
                <>
                  {label.value === "FEATURE" ? (
                    <Badge
                      className="border-blue-600 text-blue-600"
                      variant="outline">
                      {label.label}
                    </Badge>
                  ) : label.value === "DOCUMENTATION" ? (
                    <Badge
                      className="border-purple-600 text-purple-600"
                      variant="outline">
                      {label.label}
                    </Badge>
                  ) : label.value === "BUG" ? (
                    <Badge
                      className="border-amber-600 text-amber-600"
                      variant="outline">
                      {label.label}
                    </Badge>
                  ) : label.value === "ERROR" ? (
                    <Badge
                      className="border-red-600 text-red-600"
                      variant="outline">
                      {label.label}
                    </Badge>
                  ) : null}
                </>
              )}
              <div>{task.name}</div>
            </div>
            <div className="space-y-2 mt-2">
              <div className="flex items-center text-muted-foreground space-x-2">
                <span className="flex items-center">
                  <MdAccessTime className="mr-1 w-5 h-5" /> Task created on{" "}
                  {taskCreatedAt}
                </span>
                <span className="flex items-center">
                  <LuTimer className="mr-1 w-5 h-5" /> Task due on {taskDueDate}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={""} />
                  <AvatarFallback>
                    <LuUser2 className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="py-2 space-y-1">
                  <div className="pt-1">{task.member.user.name}</div>
                  <span className="text-muted-foreground text-sm pb-1">
                    {task.member.role}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                {status ? (
                  <div className="flex">
                    {status.value === "DONE" ? (
                      <span className="bg-green-100 text-green-700 text-sm font-medium me-2 px-2.5 py-0.5 rounded-md">
                        {status.label}
                      </span>
                    ) : status.value === "TO_DO" ? (
                      <span className="bg-blue-100 text-blue-700 text-sm font-medium me-2 px-2.5 py-0.5 rounded-md">
                        {status.label}
                      </span>
                    ) : status.value === "IN_PROGRESS" ? (
                      <span className="bg-amber-100 text-amber-700 text-sm font-medium me-2 px-2.5 py-0.5 rounded-md">
                        {status.label}
                      </span>
                    ) : status.value === "CANCELED" ? (
                      <span className="bg-red-100 text-red-700 text-sm font-medium me-2 px-2.5 py-0.5 rounded-md">
                        {status.label}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                {priority ? (
                  <div className="flex">
                    {priority.value === "HIGH" ? (
                      <span className="flex items-center space-x-1 bg-red-100 text-red-700 text-sm font-medium me-2 px-2.5 py-0.5 rounded-md">
                        <priority.icon />
                        {priority.label}
                      </span>
                    ) : priority.value === "MEDIUM" ? (
                      <span className="flex items-center space-x-1 bg-amber-100 text-amber-700 text-sm font-medium me-2 px-2.5 py-0.5 rounded-md">
                        <priority.icon />
                        {priority.label}
                      </span>
                    ) : priority.value === "LOW" ? (
                      <span className="flex items-center space-x-1 bg-gray-100 text-gray-700 text-sm font-medium me-2 px-2.5 py-0.5 rounded-md">
                        <priority.icon />
                        {priority.label}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            <Card className="mt-5 p-3">
              <MarkdownPreview
                // className="p-3"
                source={task.description}
                rehypePlugins={rehypePlugins}
                wrapperElement={{
                  "data-color-mode": "light",
                }}
              />
            </Card>
          </div>
          <div className="w-[350px]">
            <div className="flex flex-col space-y-2">
              <EditTaskModal
                projectId={projectId}
                memberId={task.memberId}
                members={members}
                task={task}
              />
              <Button
                variant="destructive"
                className="flex items-center w-full"
                onClick={() => taskDelete()}>
                <FiTrash className="mr-1" />
                Delete Task
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
