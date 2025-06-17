"use client";

import ProjectOverview from "./project-overview";
import TaskChart from "./task-chart";
import RecentTasks from "./recent-tasks";
import { FiGlobe, FiLock, FiUserPlus } from "react-icons/fi";
import { TbPlaylistX } from "react-icons/tb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DetailedProject, Member, ProjectTask } from "@/server/database/schema";

type Props = {
  project: DetailedProject;
  members: Member[];
  tasks: ProjectTask[];
};

export default function ProjectContent({ project, members, tasks }: Props) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{project.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold tracking-tight">
            {project.name}
          </div>
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
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[calc(100vh-150px)]">
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="rounded-full p-4 inline-block mb-4">
                <FiUserPlus className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                No members in the project
              </h3>
              <p className="mb-4 mt-2 text-base text-muted-foreground">
                There are no members in the project. Add one below from the
                membership requests.
              </p>
              <Link href={`/projects/${project.id}/members/requests`}>
                <Button className="flex items-center space-x-2 rounded-3xl">
                  <AiOutlinePlus className="w-4 h-4" />
                  <span>Add Member</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : !tasks || tasks.length == 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[calc(100vh-150px)]">
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="rounded-full p-4 inline-block mb-4">
                <TbPlaylistX className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">No tasks added</h3>
              <p className="mb-4 mt-2 text-base text-muted-foreground">
                You have not added any tasks. Add one below.
              </p>
              <Link href={`/projects/${project.id}/tasks/create`}>
                <Button className="flex items-center gap-2 rounded-3xl">
                  <AiOutlinePlus className="w-4 h-4" />
                  <span>Create Task</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ProjectOverview
              project={project}
              tasks={tasks}
              members={members}
            />
            <div className="w-full grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
              <TaskChart tasks={tasks} />
              <RecentTasks projectId={project.id} tasks={tasks} />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
