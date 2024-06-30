"use client";

import AddProjectModal from "@/components/AddProjectModal";
import JoinProjectModal from "@/components/join-project-modal";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { UserTask } from "@/lib/schema/TaskSchema";
import axios from "axios";
import { priorities } from "@/lib/config";
import TaskOverview from "./components/task-overview";
import Loading from "./components/loading";
import { tasksData } from "./components/tasks";
import RecentTasks from "./components/recent-tasks";
import TaskChart from "./components/task-chart";

interface StatusCounts {
  [key: string]: number;
}

export default function Dashboard() {
  const session = useSession();

  const userId = session.data?.user?.id;

  // const {
  //   data: tasksData,
  //   isLoading: tasksIsLoading,
  //   error: tasksError,
  // } = useQuery({
  //   queryKey: ["user-tasks", userId],
  //   queryFn: async () => {
  //     const { data } = await axios.get(`/api/users/${userId}/tasks`);
  //     return data.tasks as UserTask[];
  //   },
  // });
  const tasks =
    (tasksData
      ?.map((task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }))
      .sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      ) as UserTask[]) || [];

  // if (tasksIsLoading) {
  //   return <Loading />;
  // }

  return (
    <>
      <div className="flex items-center">
        <div className="text-2xl font-bold tracking-tight">
          Welcome, {session.data?.user?.name}!
        </div>
        <div className="ml-auto flex items-center gap-2">
          <JoinProjectModal />
          <AddProjectModal />
        </div>
      </div>

      <div className="mt-4">
        <TaskOverview tasks={tasks} />
      </div>
      <div className="grid gap-4 md:gap-4 lg:grid-cols-2 mt-6">
        <TaskChart tasks={tasks} />
        <RecentTasks tasks={tasks} />
      </div>
    </>
  );
}
