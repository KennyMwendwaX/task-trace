"use client";

import UpdateProjectDetails from "./components/update-project-details";
import ProjectVisibility from "./components/project-visibilty";
import DangerZone from "./components/danger-zone";
import ProjectInvite from "./components/project-invite";
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
import { getProject, getProjectInvitationCode } from "../actions";

type Props = {
  params: {
    projectId: string;
  };
};

export default async function Settings({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  const { projectId } = params;

  const projectResult = await getProject(projectId, session.user.id);
  const invitationCodeResult = await getProjectInvitationCode(
    projectId,
    session.user.id
  );

  if (projectResult.error) {
    throw new Error(projectResult.error);
  }

  if (invitationCodeResult.error) {
    throw new Error(invitationCodeResult.error);
  }

  const project = projectResult.data;
  const invitationCode = invitationCodeResult.data;

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
              <BreadcrumbItem>
                <BreadcrumbLink href={`/projects/${projectId}`}>
                  {project.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words max-w-full sm:max-w-[70%]">
            {project.name} Settings
          </h1>
          <UpdateProjectDetails project={project} />
        </div>

        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="order-2 md:order-1 md:flex-grow space-y-6 mt-6 md:mt-0">
            <ProjectVisibility project={project} />
            <DangerZone projectId={project.id} />
          </div>
          <div className="order-1 md:order-2 md:w-1/3">
            <ProjectInvite
              projectId={projectId}
              invitationCode={invitationCode}
            />
          </div>
        </div>
      </main>
    </>
  );
}
