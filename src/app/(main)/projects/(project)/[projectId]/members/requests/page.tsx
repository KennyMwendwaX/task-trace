"use client";

import { useProjectRequestsQuery } from "@/hooks/useProjectQueries";
import { useProjectStore } from "@/hooks/useProjectStore";
import { use } from "react";
import RequestTable from "./components/requests-table/table";
import { TableColumns } from "./components/requests-table/table-columns";
import { FiUserPlus } from "react-icons/fi";

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
      <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
        <div className="text-2xl font-bold tracking-tight">
          {project.name} Members
        </div>
        {!requests || requests.length == 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[560px]">
            <div className="flex flex-col items-center gap-1 text-center">
              <FiUserPlus className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">
                No membership requests in the project
              </h3>
              <p className="mb-4 mt-2 text-base text-muted-foreground">
                There are no requests in the project. Add one below from the
                membership requests.
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
