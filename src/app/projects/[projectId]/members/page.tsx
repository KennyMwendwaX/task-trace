"use client";

import MemberTable from "./components/member-table/table";
import { TableColumns } from "./components/member-table/table-columns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { User } from "@/lib/schema/UserSchema";
import type { Member } from "@/lib/schema/MemberSchema";
import Loading from "@/components/loading";
import { Project } from "@/lib/schema/ProjectSchema";
import { FiUserPlus } from "react-icons/fi";
import AddMemberModal from "@/components/AddMemberModal";
import { usersData } from "../components/users";
import { membersData } from "../components/members";
import { projectData } from "../components/project";

export default function Members({ params }: { params: { projectId: string } }) {
  const projectId = params.projectId;

  // const {
  //   data: project,
  //   isLoading: projectIsLoading,
  //   error: projectError,
  // } = useQuery({
  //   queryKey: ["project", projectId],
  //   queryFn: async () => {
  //     const { data } = await axios.get(`/api/projects/${projectId}`);
  //     return data.project as Project;
  //   },
  // });

  // const {
  //   data: membersData,
  //   isLoading: membersIsLoading,
  //   error: membersError,
  // } = useQuery({
  //   queryKey: ["project-members", projectId],
  //   queryFn: async () => {
  //     const { data } = await axios.get(`/api/projects/${projectId}/members`);
  //     return data.members as Member[];
  //   },
  // });

  // const {
  //   data: usersData,
  //   isLoading: usersIsLoading,
  //   error: usersError,
  // } = useQuery({
  //   queryKey: ["users"],
  //   queryFn: async () => {
  //     const { data } = await axios.get("/api/users");
  //     return data.users as User[];
  //   },
  // });

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
  const project = projectData;
  const users = usersData.map((user) => ({
    ...user,
    emailVerified: new Date(user.emailVerified),
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  })) as User[];
  const members = membersData
    ?.map((member) => ({
      ...member,
      createdAt: new Date(member.createdAt),
      updatedAt: new Date(member.updatedAt),
      tasks: member.tasks.map((task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      })),
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Member[];

  return (
    <>
      <main className="container mx-auto px-4 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
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
