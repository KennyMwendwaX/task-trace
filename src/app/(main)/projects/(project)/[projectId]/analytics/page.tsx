"use client";

import MemberLeaderboard from "./components/member-leaderboard";
import TaskStatusChart from "./components/task-status-chart";
import Loading from "./components/loading";
import { TbChartBar } from "react-icons/tb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import ProjectNotFound from "../components/project-not-found";
import {
  useProjectQuery,
  useProjectTasksQuery,
} from "@/hooks/useProjectQueries";
import { useProjectStore } from "@/hooks/useProjectStore";
import InvitationCodeModal from "../components/invitation-code-modal";

export default function Analytics({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;

  const { isLoading: projectIsLoading } = useProjectQuery(projectId);
  const { isLoading: tasksIsLoading } = useProjectTasksQuery(projectId);
  const { project, tasks } = useProjectStore();

  if (projectIsLoading || tasksIsLoading) {
    return <Loading />;
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  const isPrivateProject = !project.isPublic;
  const isNotMember = !project.member;

  if (isPrivateProject && isNotMember) {
    return <InvitationCodeModal projectId={projectId} />;
  }

  return (
    <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
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
                Analytics require tasks to be created in your project. Start by
                adding tasks to see insightful charts and performance metrics.
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
    </main>
  );
}
