import TaskTable from "./components/task-table/table";
import { TableColumns } from "./components/task-table/table-columns";
import { TbPlaylistX } from "react-icons/tb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
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
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getProject, getProjectTasks } from "../actions";
import TasksContent from "./components/tasks-content";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Tasks({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  const { projectId } = await params;

  const projectResult = await getProject(projectId, session.user.id);
  const tasksResult = await getProjectTasks(projectId, session.user.id);

  if (projectResult.error) {
    throw new Error(projectResult.error);
  }

  if (tasksResult.error) {
    throw new Error(tasksResult.error);
  }

  const project = projectResult.data;
  const tasks = tasksResult.data ?? [];

  if (!project) {
    notFound();
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
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/projects/${projectId}`}>
                  {project.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Tasks</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <TasksContent projectId={projectId} project={project} tasks={tasks} />
    </>
  );
}
