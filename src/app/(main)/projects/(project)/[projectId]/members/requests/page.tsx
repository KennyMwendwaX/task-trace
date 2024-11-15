"use client";

import { useProjectRequestsQuery } from "@/hooks/useProjectQueries";
import { useProjectStore } from "@/hooks/useProjectStore";
import { use } from "react";
import RequestTable from "./components/requests-table/table";
import { TableColumns } from "./components/requests-table/table-columns";
import { FiUserPlus } from "react-icons/fi";
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

export default function MembershipRequests(props: { params: Params }) {
  const params = use(props.params);
  const { projectId } = params;

  const { isLoading } = useProjectRequestsQuery(projectId);

  const { project, requests } = useProjectStore();

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
                <BreadcrumbLink href={`/projects/${projectId}/members`}>
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
              projectId={projectId}
              columns={TableColumns({ projectId })}
            />
          </>
        )}
      </main>
    </>
  );
}
