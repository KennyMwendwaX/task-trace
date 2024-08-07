"use client";

import AddProjectModal from "@/components/AddProjectModal";
import JoinProjectModal from "@/components/join-project-modal";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import TaskOverview from "./components/task-overview";
import Loading from "./components/loading";
import RecentTasks from "./components/recent-tasks";
import TaskChart from "./components/task-chart";
import { fetchUserTasks } from "@/lib/api/tasks";

export default function Dashboard() {
  const session = useSession();

  const userId = session.data?.user?.id;

  const {
    data: tasks = [],
    isLoading: tasksIsLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["user-tasks", userId],
    queryFn: () => fetchUserTasks(userId),
    enabled: !!userId,
  });

  return (
    <>
      {tasksIsLoading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-2xl font-bold tracking-tight mb-4 sm:mb-0">
              Welcome, {session.data?.user?.name}!
            </div>
            <div className="flex items-center gap-2">
              <JoinProjectModal />
              <AddProjectModal />
            </div>
          </div>

          <div className="mt-4">
            <TaskOverview tasks={tasks} />
          </div>
          <div className="w-full grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
            <TaskChart tasks={tasks} />
            <RecentTasks tasks={tasks} />
          </div>
        </>
      )}
    </>
  );
}
