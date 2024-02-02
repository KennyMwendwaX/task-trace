"use client";

import Loading from "@/components/Loading";
import { statuses } from "@/lib/config";
import { Task } from "@/lib/schema/TaskSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import format from "date-fns/format";

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

  return (
    <>
      <main className="p-4 md:ml-64 h-auto pt-20">
        <div className="flex items-start space-x-4">
          <div className="w-2/3">
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
          </div>
          <div>
            <div>Other div</div>
          </div>
        </div>
      </main>
    </>
  );
}
