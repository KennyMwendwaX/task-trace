"use client";

import TaskTable from "./components/task-table/table";
import { TableColumns } from "./components/task-table/table-columns";
import { useQuery } from "@tanstack/react-query";
import { TbPlaylistX } from "react-icons/tb";
import Loading from "./components/loading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import { fetchProjectTasks } from "@/lib/api/tasks";
import { fetchProjectMembers } from "@/lib/api/members";
import { fetchProject } from "@/lib/api/projects";
import { MdOutlineFolderOff } from "react-icons/md";
import { useRouter } from "next/navigation";
import { LuChevronLeft } from "react-icons/lu";

export default function Tasks({ params }: { params: { projectId: string } }) {
  const projectId = params.projectId;
  const router = useRouter();

  const {
    data: project,
    isLoading: projectIsLoading,
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

  const {
    data: members,
    isLoading: membersIsLoading,
    error: membersError,
  } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => fetchProjectMembers(projectId),
    enabled: !!projectId,
  });

  if (projectIsLoading || tasksIsLoading || membersIsLoading) {
    return (
      <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
        <Loading />
      </main>
    );
  }

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
    <>
      <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
        <div className="text-2xl font-bold tracking-tight">
          {project.name} Tasks
        </div>
        {tasks && tasks.length > 0 ? (
          <>
            <div className="text-lg text-muted-foreground">
              Here&apos;s a list of your project tasks!
            </div>
            <div className="pt-4">
              <TaskTable
                data={tasks}
                columns={TableColumns({ projectId })}
                projectId={projectId}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[560px]">
            <div className="flex flex-col items-center gap-1 text-center">
              <TbPlaylistX className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">No tasks added</h3>
              <p className="mb-4 mt-2 text-base text-muted-foreground">
                You have not added any tasks. Add one below.
              </p>
              <Link href={`/projects/${projectId}/tasks/create`}>
                <Button className="flex items-center gap-1 rounded-3xl">
                  <AiOutlinePlus className="w-4 h-4 text-white" />
                  <span>Create Task</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
