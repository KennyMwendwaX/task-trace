"use client";

import ProjectOverview from "./components/project-overview";
import TaskChart from "./components/task-chart";
import RecentTasks from "./components/recent-tasks";
import { Project } from "@/lib/schema/ProjectSchema";
import { ProjectTask } from "@/lib/schema/TaskSchema";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/loading";
import AddTaskModal from "@/components/AddTaskModal";
import { User } from "@/lib/schema/UserSchema";
import { Member } from "@/lib/schema/MemberSchema";
import AddMemberModal from "@/components/AddMemberModal";
import { FiGlobe, FiLock, FiUserPlus } from "react-icons/fi";
import { projectData } from "./components/project";
import { usersData } from "./components/users";
import { membersData } from "./components/members";
import { tasksData } from "./components/tasks";
import { TbPlaylistX } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { IoMdExit } from "react-icons/io";
import { ProjectStatus } from "@/lib/config";
import { Badge } from "@/components/ui/badge";

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;

  // const {
  //   data: project,
  //   isLoading: projectLoading,
  //   error: projectError,
  // } = useQuery({
  //   queryKey: ["project", projectId],
  //   queryFn: async () => {
  //     const { data } = await axios.get(`/api/projects/${projectId}`);
  //     return data.project as Project;
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
  //   data: tasksData,
  //   isLoading: tasksIsLoading,
  //   error: tasksError,
  // } = useQuery({
  //   queryKey: ["project-tasks", projectId],
  //   queryFn: async () => {
  //     const { data } = await axios.get(`/api/projects/${projectId}/tasks`);
  //     return data.tasks as ProjectTask[];
  //   },
  // });

  // const isLoading =
  //   projectLoading || usersIsLoading || membersIsLoading || tasksIsLoading;

  // if (isLoading) {
  //   return (
  //     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 lg:ml-[260px]">
  //       <Loading />
  //     </main>
  //   );
  // }

  // if (!project) {
  //   return (
  //     <main className="mx-auto flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 lg:ml-[260px]">
  //       <div className="mx-auto flex flex-col items-center justify-center text-center pt-36">
  //         <MdOutlineFolderOff className="h-16 w-16 text-muted-foreground" />

  //         <h3 className="mt-4 text-2xl font-semibold">Project was not found</h3>
  //       </div>
  //     </main>
  //   );
  // }
  const project = {
    ...projectData,
    status: projectData.status as ProjectStatus,
    createdAt: new Date(projectData.createdAt),
    updatedAt: new Date(projectData.updatedAt),
    invitationCode: {
      ...projectData.invitationCode,
      expiresAt: new Date(projectData.invitationCode.expiresAt),
    },
  };

  const users = usersData.map((user) => ({
    ...user,
    emailVerified: new Date(user.emailVerified),
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  })) as User[];

  const members = membersData.map((member) => ({
    ...member,
    createdAt: new Date(member.createdAt),
    updatedAt: new Date(member.updatedAt),
    tasks: member.tasks.map((task) => ({
      ...task,
      dueDate: new Date(task.dueDate),
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    })),
  })) as Member[];

  const tasks = tasksData.map((task) => ({
    ...task,
    dueDate: new Date(task.dueDate),
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
  })) as ProjectTask[];

  return (
    <main className="flex flex-1 flex-col gap-2 p-4 lg:pt-4 lg:ml-[260px]">
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold tracking-tight">{project.name}</div>
        <Badge
          variant={project.isPublic ? "secondary" : "outline"}
          className="flex items-center gap-1">
          {project.isPublic ? (
            <>
              <FiGlobe className="w-3 h-3" />
              Public
            </>
          ) : (
            <>
              <FiLock className="w-3 h-3" />
              Private
            </>
          )}
        </Badge>
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
      ) : !tasks || tasks.length == 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[520px]">
          <div className="flex flex-col items-center gap-1 text-center">
            <TbPlaylistX className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">No tasks added</h3>
            <p className="mb-4 mt-2 text-base text-muted-foreground">
              You have not added any tasks. Add one below.
            </p>
            <AddTaskModal projectId={projectId} members={members} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <ProjectOverview project={project} tasks={tasks} members={members} />
          <div className="w-full grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
            <TaskChart tasks={tasks} />
            <RecentTasks projectId={projectId} tasks={tasks} />
          </div>
        </div>
      )}
    </main>
  );
}
