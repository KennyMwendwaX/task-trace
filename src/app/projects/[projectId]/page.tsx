"use client";

import TaskOverview from "./components/task-overview";
import TaskChart from "./components/task-chart";
import LatestTasks from "./components/latest-tasks";
import { Project } from "@/lib/schema/ProjectSchema";
import { ProjectTask } from "@/lib/schema/TaskSchema";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/loading";
import { MdOutlineAddTask } from "react-icons/md";
import AddTaskModal from "@/components/AddTaskModal";
import { User } from "@/lib/schema/UserSchema";
import { Member } from "@/lib/schema/MemberSchema";
import AddMemberModal from "@/components/AddMemberModal";
import { FiUserPlus } from "react-icons/fi";

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
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
    queryKey: ["project-members", projectId],
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
    queryKey: ["project-tasks", projectId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${projectId}/tasks`);
      return data.tasks as ProjectTask[];
    },
  });

  const isLoading =
    projectLoading || usersIsLoading || membersIsLoading || tasksIsLoading;

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 lg:ml-[260px]">
        <Loading />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 lg:ml-[260px]">
        <div className="text-2xl font-bold tracking-tight">
          Project was not found
        </div>
      </main>
    );
  }

  const users = usersData || [];
  const members = membersData || [];
  const tasks = tasksData || [];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 lg:ml-[260px]">
      {!members || members.length == 0 ? (
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
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
          <TaskOverview tasks={tasks} />
          <div className="flex space-x-4 items-start">
            <TaskChart tasks={tasks} />
            <LatestTasks projectId={projectId} tasks={tasks} />
          </div>
        </div>
      )}
    </main>
  );
}
