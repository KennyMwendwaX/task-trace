"use client";

import ProjectOverview from "./components/project-overview";
import TaskChart from "./components/task-chart";
import RecentTasks from "./components/recent-tasks";
import { Project } from "@/lib/schema/ProjectSchema";
import { ProjectTask } from "@/lib/schema/TaskSchema";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "./components/loading";
import AddTaskModal from "@/components/AddTaskModal";
import { User } from "@/lib/schema/UserSchema";
import { Member } from "@/lib/schema/MemberSchema";
import AddMemberModal from "@/components/AddMemberModal";
import { FiGlobe, FiLock, FiUserPlus } from "react-icons/fi";
import { TbPlaylistX } from "react-icons/tb";
import { Badge } from "@/components/ui/badge";
import { MdOutlineFolderOff } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LuChevronLeft } from "react-icons/lu";

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;
  const router = useRouter();

  const fetchProject = async (projectId: string): Promise<Project> => {
    if (!projectId) throw new Error("No project ID");
    try {
      const { data } = await axios.get<{ project: Project }>(
        `/api/projects/${projectId}`
      );
      return {
        ...data.project,
        createdAt: new Date(data.project.createdAt),
        updatedAt: data.project.updatedAt
          ? new Date(data.project.updatedAt)
          : null,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch project: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  };

  const fetchUsers = async (): Promise<User[]> => {
    try {
      const { data } = await axios.get<{ users: User[] }>("/api/users");
      return data.users.map((user) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: user.updatedAt ? new Date(user.updatedAt) : null,
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  };

  const fetchProjectMembers = async (projectId: string) => {
    if (!projectId) throw new Error("No project ID");
    try {
      const { data } = await axios.get<{ members: Member[] }>(
        `/api/projects/${projectId}/members`
      );
      return data.members.map((member) => ({
        ...member,
        createdAt: new Date(member.createdAt),
        updatedAt: member.updatedAt ? new Date(member.updatedAt) : null,
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch project members: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  };

  const fetchProjectTasks = async (projectId: string) => {
    if (!projectId) throw new Error("No project ID");
    try {
      const { data } = await axios.get<{ tasks: ProjectTask[] }>(
        `/api/projects/${projectId}/tasks`
      );
      return data.tasks.map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : null,
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch project tasks: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  };

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
    data: users,
    isLoading: usersIsLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  const {
    data: members,
    isLoading: membersIsLoading,
    error: membersError,
  } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => fetchProjectMembers(projectId),
    enabled: !!projectId,
  });

  const {
    data: tasks,
    isLoading: tasksIsLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: () => fetchProjectTasks(projectId),
    enabled: !!projectId,
  });

  const isLoading =
    projectLoading || usersIsLoading || membersIsLoading || tasksIsLoading;

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-2 p-4 lg:pt-4 lg:ml-[260px]">
        <Loading />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex flex-1 flex-col gap-2 p-4 lg:pt-4 lg:ml-[260px]">
        <div className="text-center">
          <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
            <MdOutlineFolderOff className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            No Project Found
          </h2>
          <p className="text-gray-600 mb-4">
            The project you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              variant="default"
              className="flex items-center justify-center gap-2"
              onClick={() => router.push("/dashboard")}>
              <LuChevronLeft className="w-5 h-5" />
              Return to Dashboard
            </Button>
          </div>
        </div>
      </main>
    );
  }

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
            {users && <AddMemberModal projectId={projectId} users={users} />}
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
          <ProjectOverview tasks={tasks} members={members} />
          <div className="w-full grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
            <TaskChart tasks={tasks} />
            <RecentTasks projectId={projectId} tasks={tasks} />
          </div>
        </div>
      )}
    </main>
  );
}
