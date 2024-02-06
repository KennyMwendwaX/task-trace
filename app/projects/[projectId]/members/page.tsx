"use client";

import { TableColumns } from "@/components/tables/TeamTable/TableColumns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Member } from "@/lib/schema/UserSchema";
import Loading from "@/components/Loading";
import TeamTable from "@/components/tables/TeamTable/TeamTable";
import { Project } from "@/lib/schema/ProjectSchema";

export default function Team({ params }: { params: { projectId: string } }) {
  const projectId = params.projectId;

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${projectId}`);
      return data.project as Project;
    },
  });

  const {
    data: membersData,
    isLoading: membersLoading,
    error: membersError,
  } = useQuery({
    queryKey: ["members", projectId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${projectId}/members`);
      return data.members as Member[];
    },
  });

  if (projectLoading || membersLoading) {
    return (
      <main className="p-4 md:ml-64 h-auto pt-20">
        <Loading />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="p-4 md:ml-64 h-auto pt-20">
        <div className="text-2xl font-bold tracking-tight">
          Project was not found
        </div>
      </main>
    );
  }

  const members =
    membersData
      ?.map((member) => ({
        ...member,
        createdAt: new Date(member.createdAt),
        updatedAt: new Date(member.updatedAt),
        tasks: member.tasks.map((task) => ({
          ...task,
          due_date: new Date(task.due_date),
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        })),
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) || [];

  return (
    <>
      <main className="p-4 md:ml-64 h-auto pt-20">
        <div className="text-3xl font-bold tracking-tight">
          {project.name} Project Members
        </div>
        <div className="text-xl text-muted-foreground">
          Here&apos;s a list of your project members!
        </div>
        <TeamTable data={members} columns={TableColumns} />
      </main>
    </>
  );
}
