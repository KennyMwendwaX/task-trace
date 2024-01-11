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
      const { data } = await axios.get(`/api/user/tasks/${taskId}`);
      return data.task as Task;
    },
  });

  const task = data;

  return (
    <>
      <div className="container mx-auto mt-4 px-12 pb-5 pt-12">
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
      </div>
    </>
  );
}
