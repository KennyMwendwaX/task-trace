"use client";

import AddProjectModal from "@/components/add-project-modal";
import { useSession } from "next-auth/react";
import TaskOverview from "./components/task-overview";
import Loading from "./components/loading";
import RecentTasks from "./components/recent-tasks";
import TaskChart from "./components/task-chart";
import { useUserTasksQuery } from "@/hooks/useUserQueries";
import { useUserStore } from "@/hooks/useUserStore";

export default function Dashboard() {
  const session = useSession();
  const userId = session.data?.user?.id;

  const { isLoading: tasksIsLoading } = useUserTasksQuery(userId);
  const { tasks } = useUserStore();

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
            <AddProjectModal />
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
