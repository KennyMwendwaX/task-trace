"use client";

import MemberLeaderboard from "./components/member-leaderboard";
import TaskStatusChart from "./components/task-status-chart";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectTasks } from "@/lib/api/tasks";
import Loading from "./components/loading";

export default function Analytics({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;
  const {
    data: tasks = [],
    isLoading: tasksIsLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: () => fetchProjectTasks(projectId),
    enabled: !!projectId,
  });

  const isLoading = true;

  return (
    <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="text-2xl font-bold tracking-tight">Analytics</div>
          <div className="w-full grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
            <MemberLeaderboard tasks={tasks} />
            <TaskStatusChart tasks={tasks} />
          </div>
        </>
      )}
    </main>
  );
}
