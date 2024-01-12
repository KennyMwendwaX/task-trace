"use client";

import Loading from "@/components/Loading";
import { Task, taskSchema } from "@/lib/schema/TaskSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Task({ params }: { params: { taskId: string } }) {
  const taskId = params.taskId;

  const { data, isLoading, error } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      // ! Add correct api route url
      const { data } = await axios.get(`/api/projects/${taskId}`);
      return data.task as Task;
    },
  });

  const task = data;

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:px-6 md:pt-20 pb-4">
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
