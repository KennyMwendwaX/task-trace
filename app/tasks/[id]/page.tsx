"use client";

import { taskSchema } from "@/lib/schema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Task({ params }: { params: { slug: string } }) {
  const id = params.slug;

  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/tasks/${id}`);
      return data.tasks;
    },
  });

  const task = taskSchema.parse(data);

  return (
    <>
      <div className="container mx-auto mt-4 px-12 pb-5 pt-12">
        {task == null ? (
          <div className="text-2xl font-bold tracking-tight">
            Task was not found
          </div>
        ) : (
          <div className="text-2xl font-bold tracking-tight">Task</div>
        )}
      </div>
    </>
  );
}
