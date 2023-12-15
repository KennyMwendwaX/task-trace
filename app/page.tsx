"use client";

import TaskOverview from "@/components/TaskOverview";
import TaskChart from "@/components/TaskChart";
import LatestTasks from "@/components/LatestTasks";
import { Task } from "@/lib/schema";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get("/api/tasks");
      return data.tasks as Task[];
    },
  });

  const tasks = data || [];
  return (
    <>
      <div className="container mx-auto mt-4 px-12 pb-5 pt-12">
        <h2 className="text-3xl font-bold tracking-tight pb-2">Dashboard</h2>

        {isLoading ? (
          <Loading />
        ) : tasks.length > 0 ? (
          <>
            <TaskOverview tasks={tasks} />
            <div className="flex space-x-4 items-start pt-5">
              <TaskChart tasks={tasks} />
              <LatestTasks tasks={tasks} />
            </div>
          </>
        ) : (
          <div>No tasks available</div>
        )}
      </div>
    </>
  );
}
