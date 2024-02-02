"use client";

import Loading from "@/components/Loading";
import { statuses } from "@/lib/config";
import { Task } from "@/lib/schema/TaskSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import format from "date-fns/format";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeSanitize from "rehype-sanitize";

export default function Task({
  params,
}: {
  params: { projectId: string; taskId: string };
}) {
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
  const rehypePlugins = [rehypeSanitize];

  const markdown = `
  # Issue Title

## Description
Provide a clear and concise description of the issue here.

## Steps to Reproduce
1. First step to reproduce the issue
2. Second step to reproduce the issue
3. ...

## Expected Behavior
Explain what you expected to happen.

## Actual Behavior
Explain what actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- Operating System: [e.g. Windows 10, macOS 12.1, Ubuntu 20.04]
- Browser (if applicable): [e.g. Chrome 98.0, Firefox 97.0]
- Application Version/Commit: [e.g. v1.2.3, commit hash]

## Additional Information
Add any other context about the problem here.

  `;

  return (
    <>
      <main className="p-4 md:ml-64 h-auto pt-20">
        <div className="flex items-start space-x-4">
          <div className="w-[650px]">
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

              <span>Task Created on {taskCreatedAt}</span>
            </div>
            <div className="pt-5">
              <MarkdownPreview
                className="border border-black rounded-xl p-3"
                source={markdown}
                rehypePlugins={rehypePlugins}
                wrapperElement={{
                  "data-color-mode": "light",
                }}
              />
            </div>
          </div>
          <div>
            <div>Other div</div>
          </div>
        </div>
      </main>
    </>
  );
}
