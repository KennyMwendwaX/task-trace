"use client";

import MemberTable from "./components/member-table/table";
import { TableColumns } from "./components/member-table/table-columns";
import { useQuery } from "@tanstack/react-query";
import { FiUserPlus } from "react-icons/fi";
import AddMemberModal from "@/components/AddMemberModal";
import { fetchProjectMembers } from "@/lib/api/members";
import { fetchUsers } from "@/lib/api/users";
import { fetchProject } from "@/lib/api/projects";

export default function Members({ params }: { params: { projectId: string } }) {
  const projectId = params.projectId;

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });

  const {
    data: members = [],
    isLoading: membersIsLoading,
    error: membersError,
  } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => fetchProjectMembers(projectId),
  });

  const {
    data: users = [],
    isLoading: usersIsLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  // if (projectIsLoading || membersIsLoading || usersIsLoading) {
  //   return (
  //     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 lg:ml-[260px]">
  //       <Loading />
  //     </main>
  //   );
  // }

  // if (!project) {
  //   return (
  //     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 lg:ml-[260px]">
  //       <div className="text-2xl font-bold tracking-tight">
  //         Project was not found
  //       </div>
  //     </main>
  //   );
  // }

  return (
    <>
      <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
        <div className="text-2xl font-bold tracking-tight">
          {project.name} Members
        </div>
        {!members || members.length == 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[520px]">
            <div className="flex flex-col items-center gap-1 text-center">
              <FiUserPlus className="h-12 w-12 text-muted-foreground" />

              <h3 className="mt-4 text-xl font-semibold">
                No members in the project
              </h3>
              <p className="mb-4 mt-2 text-base text-muted-foreground">
                There are no members in the project. Add one below.
              </p>
              <AddMemberModal projectId={projectId} users={users} />
            </div>
          </div>
        ) : (
          <>
            <div className="text-lg text-muted-foreground">
              Here&apos;s a list of your project members!
            </div>
            <MemberTable
              data={members}
              users={users}
              projectId={projectId}
              columns={TableColumns({ projectId })}
            />
          </>
        )}
      </main>
    </>
  );
}
