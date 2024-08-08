"use client";

import MemberLeaderboard from "./components/member-leaderboard";
import TaskStatusChart from "./components/task-status-chart";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectTasks } from "@/lib/api/tasks";
import Loading from "./components/loading";
import { TbChartBar } from "react-icons/tb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import { fetchProject } from "@/lib/api/projects";
import { MdOutlineFolderOff } from "react-icons/md";
import { LuChevronLeft } from "react-icons/lu";
import { useRouter } from "next/navigation";

export default function Analytics({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;
  const router = useRouter();

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });

  const {
    data: tasks = [],
    isLoading: tasksIsLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: () => fetchProjectTasks(projectId),
    enabled: !!projectId,
  });

  if (!project) {
    return (
      <main className="flex flex-1 flex-col gap-2 p-4 lg:pt-4 lg:ml-[260px]">
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[560px]">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
              <MdOutlineFolderOff className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              No Project Found
            </h2>
            <p className="text-gray-600 mb-4">
              The project you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                variant="default"
                className="flex items-center justify-center gap-2 rounded-full"
                onClick={() => router.push("/dashboard")}>
                <LuChevronLeft className="w-5 h-5" />
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
      {tasksIsLoading ? (
        <Loading />
      ) : (
        <>
          {tasks.length > 0 ? (
            <>
              <div className="text-2xl font-bold tracking-tight">Analytics</div>
              <div className="w-full grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
                <MemberLeaderboard tasks={tasks} />
                <TaskStatusChart tasks={tasks} />
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[560px]">
              <div className="flex flex-col items-center gap-1 text-center max-w-md">
                <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
                  <TbChartBar className="h-14 w-14 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-2xl font-semibold">
                  No Analytics Available
                </h3>
                <p className="mb-4 mt-2 text-lg text-muted-foreground">
                  Analytics require tasks to be created in your project. Start
                  by adding tasks to see insightful charts and performance
                  metrics.
                </p>
                <p className="text-base text-muted-foreground mb-6">
                  Once you have tasks, you&apos;ll be able to view:
                </p>
                <ul className="list-disc text-left text-base text-muted-foreground mb-6">
                  <li>Task status distribution</li>
                  <li>Team member performance</li>
                  <li>Project progress over time</li>
                </ul>
                <Link href={`/projects/${projectId}/tasks/create`}>
                  <Button className="flex items-center gap-1 rounded-3xl">
                    <AiOutlinePlus className="w-4 h-4 text-white" />
                    <span>Create Task</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
