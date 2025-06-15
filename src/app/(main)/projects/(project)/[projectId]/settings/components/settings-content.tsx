"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UpdateProjectDetails from "./update-project-details";
import ProjectVisibility from "./project-visibilty";
import DangerZone from "./danger-zone";
import ProjectInvite from "./project-invite";
import { DetailedProject, InvitationCode } from "@/server/database/schema";
import Link from "next/link";

type Props = {
  project: DetailedProject;
  invitationCode: InvitationCode | null;
};

export default function SettingsContent({ project, invitationCode }: Props) {
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
              <BreadcrumbItem className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/projects">Projects</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/projects/${project.id}`}>
                        {project.name}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/projects/${project.id}`}>
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
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
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
              projectId={project.id}
              invitationCode={invitationCode}
            />
          </div>
        </div>
      </main>
    </>
  );
}
