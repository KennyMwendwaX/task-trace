"use client";

import UserTable from "@/components/tables/UserTable/UserTable";
import { TableColumns } from "@/components/tables/UserTable/TableColumns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { User } from "@/lib/schema/UserSchema";
import Loading from "@/components/Loading";

export default function Team() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get("/api/users");
      return data.users as User[];
    },
  });

  const members =
    data
      ?.map((member) => ({
        ...member,
        createdAt: new Date(member.createdAt),
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
      <div className="container mx-auto mt-4 px-12 pb-5 pt-12">
        <div className="text-3xl font-bold tracking-tight">Team Members</div>
        <div className="text-xl text-muted-foreground">
          Here&apos;s a list of your team!
        </div>
        <UserTable data={members} columns={TableColumns} />
      </div>
    </>
  );
}
