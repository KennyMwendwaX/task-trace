"use client";

import Loading from "@/components/Loading";
import { Task, taskSchema } from "@/lib/schema/TaskSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Task({
  params,
}: {
  params: { projectId: string; taskId: string };
}) {
  const projectId = params.projectId;
  const taskId = params.taskId;

  const { data, isLoading, error } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      // ! Add correct api route url
      const { data } = await axios.get(
        `/api/projects/${projectId}/tasks/${taskId}`
      );
      return data.task as Task;
    },
  });

  const task = data;

  return (
    <>
      <main className="p-4 md:ml-64 h-auto pt-20">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {task == null ? (
              <div className="text-2xl font-bold tracking-tight">
                Task was not found
              </div>
            ) : (
              <div className="text-2xl font-bold tracking-tight">Task</div>
            )}
          </>
        )}
      </main>
    </>
  );
}
