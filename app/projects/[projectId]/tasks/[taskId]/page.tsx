"use client";

import Loading from "@/components/Loading";
import { statuses } from "@/lib/config";
import { Task } from "@/lib/schema/TaskSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import format from "date-fns/format";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LuUser2 } from "react-icons/lu";

export default function Task({
  params,
}: {
  params: { projectId: string; taskId: string };
}) {
  const [markdown, setMarkdown] = useState<string | null>(null);

  const projectId = params.projectId;
  const taskId = params.taskId;

  const { data, isLoading, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/projects/${projectId}/tasks/${taskId}`
      );
      return data.task as Task;
    },
  });

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/kenny-mwendwa/go-restapi-crud/master/README.md"
    )
      .then((response) => response.text()) // Extract the text content from the response
      .then((data) => setMarkdown(data)) // Set the Markdown content to state
      .catch((error) => console.error("Error fetching Markdown:", error));
  }, []);

  const task = data;

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
  const taskCreatedAt = format(new Date(task.createdAt), "dd/MM/yyyy");

  // Added a plugin to sanitize the markdown
  const rehypePlugins = [rehypeSanitize, rehypeStringify, rehypeHighlight];

  return (
    <>
      <main className="p-4 md:ml-64 h-auto pt-20">
        <div className="flex items-start space-x-4">
          <div className="w-[850px]">
            <div className="text-2xl font-bold tracking-tight">{task.name}</div>
            <div className="flex items-center space-x-3 pt-3">
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

              <span className="text-muted-foreground">
                Task Created on {taskCreatedAt}
              </span>
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
              <div className="px-6 flex items-center space-x-2 bg-slate-200 rounded-xl">
                <Avatar>
                  <AvatarImage src={""} />
                  <AvatarFallback>
                    <LuUser2 className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="py-2 space-y-1">
                  <div className="pt-1">John Doe</div>
                  <span className="text-muted-foreground text-sm pb-1">
                    johndoe@gmail.com
                  </span>
                </div>
              </div>
              <Button variant="outline" className="flex items-center w-full">
                <FiEdit className="mr-1" />
                Edit Task
              </Button>
              <Button
                variant="destructive"
                className="flex items-center w-full">
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
