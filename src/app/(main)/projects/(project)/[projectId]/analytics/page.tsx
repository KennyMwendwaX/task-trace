"use client";

import MemberLeaderboard from "./components/member-leaderboard";
import TaskStatusChart from "./components/task-status-chart";
import { TbChartBar } from "react-icons/tb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import { useProjectStore } from "@/hooks/useProjectStore";
import { use } from "react";
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

type Params = Promise<{ projectId: string }>;

export default function Analytics(props: { params: Params }) {
  const params = use(props.params);
  const { projectId } = params;

  const { project, tasks } = useProjectStore();

  if (!project) {
    return null;
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/projects/${projectId}`}>
                  {project.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Analytics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {tasks.length > 0 ? (
          <>
            <div className="text-2xl font-bold tracking-tight">Analytics</div>
            <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
              <MemberLeaderboard tasks={tasks} />
              <TaskStatusChart tasks={tasks} />
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[calc(100vh-150px)]">
            <div className="flex flex-col items-center gap-1 text-center max-w-md">
              <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
                <TbChartBar className="h-12 w-12 text-muted-foreground" />
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
      </main>
    </>
  );
}
