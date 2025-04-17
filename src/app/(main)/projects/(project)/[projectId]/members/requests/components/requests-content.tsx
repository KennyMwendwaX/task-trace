"use client";

import RequestTable from "./requests-table/table";
import { TableColumns } from "./requests-table/table-columns";
import { FiUserPlus } from "react-icons/fi";
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
import Link from "next/link";
import { DetailedProject, ProjectMembershipRequest } from "@/database/schema";

type Props = {
  project: DetailedProject;
  requests: ProjectMembershipRequest[];
};

export default function RequestsContent({ project, requests }: Props) {
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
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
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
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/projects/${project.id}/members`}>
                  Members
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Membership Requests</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="text-2xl font-bold tracking-tight">
          {project.name} Membership Requests
        </div>
        {!requests || requests.length == 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[calc(100vh-150px)]">
            <div className="flex flex-col items-center gap-1 text-center">
              <FiUserPlus className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">
                No membership requests in the project
              </h3>
              <p className="mb-4 mt-2 text-base text-muted-foreground">
                There are no membership requests currently in the project.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-lg text-muted-foreground">
              Here&apos;s a list of your project membership requests!
            </div>
            <RequestTable
              data={requests}
              projectId={project.id}
              columns={TableColumns()}
            />
          </>
        )}
      </main>
    </>
  );
}
