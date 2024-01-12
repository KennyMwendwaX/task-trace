"use client";

import TaskOverview from "@/components/TaskOverview";
import TaskChart from "@/components/TaskChart";
import LatestTasks from "@/components/LatestTasks";
import { Task } from "@/lib/schema/TaskSchema";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import { MdOutlineAddTask } from "react-icons/md";
import AddTaskModal from "@/components/AddTaskModal";
import { Member, User } from "@/lib/schema/UserSchema";
import AddMemberModal from "@/components/AddMemberModal";
import { FiUserPlus } from "react-icons/fi";

export default function Project({ params }: { params: { projectId: string } }) {
  const projectId = params.projectId;

  const {
    data: usersData,
    isLoading: usersIsLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get("/api/users");
      return data.users as User[];
    },
  });

  const {
    data: membersData,
    isLoading: membersIsLoading,
    error: membersError,
  } = useQuery({
    queryKey: ["members", projectId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${projectId}/members`);
      return data.members as Member[];
    },
  });

  const {
    data: tasksData,
    isLoading: tasksIsLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${projectId}/tasks`);
      return data.tasks as Task[];
    },
  });

  const users = usersData || [];
  const members = membersData || [];
  const tasks = tasksData || [];

  const isLoading = usersIsLoading || membersIsLoading || tasksIsLoading;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:px-6 md:pt-20 pb-4">
      {isLoading ? (
        <Loading />
      ) : !members || members.length == 0 ? (
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center pt-36">
          <FiUserPlus className="h-14 w-14 text-muted-foreground" />

          <h3 className="mt-4 text-2xl font-semibold">
            No members in the project
          </h3>
          <p className="mb-4 mt-2 text-lg text-muted-foreground">
            There are no members in the project. Add one below.
          </p>
          <AddMemberModal projectId={projectId} users={users} />
        </div>
      ) : !tasks || tasks.length == 0 ? (
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center pt-36">
          <MdOutlineAddTask className="h-14 w-14 text-muted-foreground" />

          <h3 className="mt-4 text-2xl font-semibold">No tasks added</h3>
          <p className="mb-4 mt-2 text-lg text-muted-foreground">
            You have not added any tasks. Add one below.
          </p>
          <AddTaskModal projectId={projectId} members={members} />
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold tracking-tight pb-2">Dashboard</h2>
          <TaskOverview tasks={tasks} />
          <div className="flex space-x-4 items-start pt-5">
            <TaskChart tasks={tasks} />
            <LatestTasks projectId={projectId} tasks={tasks} />
          </div>
        </>
      )}
    </main>
  );
}
