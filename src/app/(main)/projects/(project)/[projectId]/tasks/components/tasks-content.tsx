"use client";

import { DetailedProject } from "@/lib/schema/ProjectSchema";
import { ProjectTask } from "@/lib/schema/TaskSchema";
import TaskTable from "./task-table/table";
import { TableColumns } from "./task-table/table-columns";
import { TbPlaylistX } from "react-icons/tb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";

interface TasksContentProps {
  projectId: string;
  project: DetailedProject;
  tasks: ProjectTask[];
}

export default function TasksContent({
  projectId,
  project,
  tasks,
}: TasksContentProps) {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
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
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[calc(100vh-150px)]">
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
  );
}
