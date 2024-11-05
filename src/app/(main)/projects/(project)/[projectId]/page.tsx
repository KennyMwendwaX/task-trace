"use client";

import ProjectOverview from "./components/project-overview";
import TaskChart from "./components/task-chart";
import RecentTasks from "./components/recent-tasks";
import Loading from "./components/loading";
import AddMemberModal from "@/components/add-member-modal";
import { FiGlobe, FiLock, FiUserPlus } from "react-icons/fi";
import { TbPlaylistX } from "react-icons/tb";
import { Badge } from "@/components/ui/badge";
import ProjectNotFound from "./components/project-not-found";
import {
  useProjectMembersQuery,
  useProjectQuery,
  useProjectTasksQuery,
} from "@/hooks/useProjectQueries";
import { useUsersQuery } from "@/hooks/useUserQueries";
import { useProjectStore } from "@/hooks/useProjectStore";
import { useUserStore } from "@/hooks/useUserStore";
import JoinProjectModal from "./components/join-project-modal";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;

  const { project, members, tasks } = useProjectStore();
  const { users } = useUserStore();

  if (!project) {
    return null;
  }

  return (
    <main className="flex flex-1 flex-col gap-2 p-4 lg:pt-4 lg:ml-[260px]">
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold tracking-tight">{project.name}</div>
        <Badge
          variant={project.isPublic ? "secondary" : "outline"}
          className="flex items-center gap-1">
          {project.isPublic ? (
            <>
              <FiGlobe className="w-3 h-3" />
              Public
            </>
          ) : (
            <>
              <FiLock className="w-3 h-3" />
              Private
            </>
          )}
        </Badge>
      </div>
      {!members || members.length == 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[560px]">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
              <FiUserPlus className="h-14 w-14 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">
              No members in the project
            </h3>
            <p className="mb-4 mt-2 text-base text-muted-foreground">
              There are no members in the project. Add one below.
            </p>
            {users && <AddMemberModal projectId={projectId} users={users} />}
          </div>
        </div>
      ) : !tasks || tasks.length == 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[560px]">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
              <TbPlaylistX className="h-14 w-14 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">No tasks added</h3>
            <p className="mb-4 mt-2 text-base text-muted-foreground">
              You have not added any tasks. Add one below.
            </p>
            <Link href={`/projects/${projectId}/tasks/create`}>
              <Button className="flex items-center space-x-2 rounded-3xl">
                <AiOutlinePlus className="w-4 h-4 text-white" />
                <span>New Task</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <ProjectOverview project={project} tasks={tasks} members={members} />
          <div className="w-full grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
            <TaskChart tasks={tasks} />
            <RecentTasks projectId={projectId} tasks={tasks} />
          </div>
        </div>
      )}
    </main>
  );
}
