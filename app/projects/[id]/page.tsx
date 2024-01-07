"use client";

import TaskOverview from "@/components/TaskOverview";
import TaskChart from "@/components/TaskChart";
import LatestTasks from "@/components/LatestTasks";
import { Task } from "@/lib/schema/TaskSchema";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import { MdOutlineAddTask } from "react-icons/md";
import AddTaskModal from "@/components/AddTaskModal";

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get("/api/user/tasks");
      return data.tasks as Task[];
    },
  });

  const tasks = data || [];
  return (
    <>
      <div className="container mx-auto mt-4 px-12 pb-5 pt-12">
        {isLoading ? (
          <Loading />
        ) : tasks.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold tracking-tight pb-2">
              Dashboard
            </h2>
            <TaskOverview tasks={tasks} />
            <div className="flex space-x-4 items-start pt-5">
              <TaskChart tasks={tasks} />
              <LatestTasks tasks={tasks} />
            </div>
          </>
        ) : (
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center pt-36">
            <MdOutlineAddTask className="h-14 w-14 text-muted-foreground" />

            <h3 className="mt-4 text-2xl font-semibold">No tasks added</h3>
            <p className="mb-4 mt-2 text-lg text-muted-foreground">
              You have not added any tasks. Add one below.
            </p>
            <AddTaskModal />
          </div>
        )}
      </div>
    </>
  );
}