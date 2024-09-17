"use client";

import MemberTable from "./components/member-table/table";
import { TableColumns } from "./components/member-table/table-columns";
import { FiUserPlus } from "react-icons/fi";
import AddMemberModal from "@/components/add-member-modal";
import Loading from "./components/loading";
import ProjectNotFound from "../components/project-not-found";
import {
  useProjectMembersQuery,
  useProjectQuery,
} from "@/hooks/useProjectQueries";
import { useUsersQuery } from "@/hooks/useUserQueries";
import { useProjectStore } from "@/hooks/useProjectStore";
import { useUserStore } from "@/hooks/useUserStore";
import InvitationCodeModal from "../components/invitation-code-modal";

export default function Members({ params }: { params: { projectId: string } }) {
  const projectId = params.projectId;

  const { isLoading: projectIsLoading } = useProjectQuery(projectId);
  const { isLoading: usersIsLoading } = useUsersQuery();
  const { isLoading: membersIsLoading } = useProjectMembersQuery(projectId);

  const { project, members } = useProjectStore();
  const { users } = useUserStore();

  if (projectIsLoading || membersIsLoading || usersIsLoading) {
    return <Loading />;
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  const isPrivateProject = !project.isPublic;
  const isNotMember = !project.member;

  if (isPrivateProject && isNotMember) {
    return <InvitationCodeModal projectId={projectId} />;
  }

  return (
    <>
      <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
        <div className="text-2xl font-bold tracking-tight">
          {project.name} Members
        </div>
        {!members || members.length == 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[560px]">
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
