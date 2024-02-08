"use client";

import Loading from "@/components/Loading";
import { priorities, statuses } from "@/lib/config";
import { Task } from "@/lib/schema/TaskSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import format from "date-fns/format";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiTrash } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LuTimer, LuUser2 } from "react-icons/lu";
import { MdAccessTime } from "react-icons/md";
import { Member } from "@/lib/schema/UserSchema";
import EditTaskModal from "@/components/EditTaskModal";
import { useRouter } from "next/navigation";

export default function Task({
  params,
}: {
  params: { projectId: string; taskId: string };
}) {
  const [markdown, setMarkdown] = useState<string | null>(null);

  const projectId = params.projectId;
  const taskId = params.taskId;

  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/kenny-mwendwa/go-restapi-crud/master/README.md"
    )
      .then((response) => response.text()) // Extract the text content from the response
      .then((data) => setMarkdown(data)) // Set the Markdown content to state
      .catch((error) => console.error("Error fetching Markdown:", error));
  }, []);

  const {
    data,
    isLoading: taskLoading,
    error,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/projects/${projectId}/tasks/${taskId}`
      );
      return data.task as Task;
    },
  });

  const task = data;

  const {
    data: member,
    isLoading: memberLoading,
    error: memberError,
  } = useQuery({
    queryKey: ["member", task?.memberId],
    queryFn: async () => {
      if (task?.memberId) {
        const { data } = await axios.get(
          `/api/projects/${projectId}/members/${task.memberId}`
        );
        return data.member as Member;
      }
      return null; // Return null if memberId is not available
    },
    enabled: !!task, // Only fetch when task data is available
  });

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
      if (task?.id) {
        const options = {
          method: "DELETE",
        };
        const response = await fetch(
          `/api/projects/${projectId}/tasks/${task?.id}`,
          options
        );
        if (!response.ok) {
          throw new Error("Something went wrong");
        }
      }
      return null;
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

  const isLoading = taskLoading || memberLoading;

  if (isLoading) {
    return (
      <main className="p-4 md:ml-64 h-auto pt-20">
        <Loading />
      </main>
    );
  }

  if (!task) {
    return (
      <main className="p-4 md:ml-64 h-auto pt-20">
        <div className="text-2xl font-bold tracking-tight">
          Task was not found
        </div>
      </main>
    );
  }

  const status = statuses.find((status) => status.value === task.status);
  const priority = priorities.find(
    (priority) => priority.value === task.priority
  );
  const taskCreatedAt = format(
    new Date(task.createdAt),
    "dd MMM, yyyy • hh:ssb"
  );
  const taskDueDate = format(new Date(task.due_date), "dd MMM, yyyy");

  // Added a plugin to sanitize the markdown
  const rehypePlugins = [rehypeSanitize, rehypeStringify, rehypeHighlight];

  const taskDelete = async () => {
    deleteTask();
    router.push(`/projects/${projectId}/tasks`);
  };

  return (
    <>
      <main className="p-4 md:ml-64 h-auto pt-20">
        <div className="flex items-start space-x-4">
          <div className="w-[850px]">
            <div className="text-2xl font-bold tracking-tight">{task.name}</div>
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
                  <div className="pt-1">{member?.userName}</div>
                  <span className="text-muted-foreground text-sm pb-1">
                    {member?.role}
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
                source={markdown as string}
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
