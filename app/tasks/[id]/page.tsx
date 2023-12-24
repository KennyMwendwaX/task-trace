"use client";

import Loading from "@/components/Loading";
import { Task, taskSchema } from "@/lib/schema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Task({ params }: { params: { id: string } }) {
  const id = params.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/tasks/${id}`);
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
