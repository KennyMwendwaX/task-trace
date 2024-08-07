"use client";

import { ProjectTask } from "@/lib/schema/TaskSchema";
import { tasksData } from "../components/tasks";
import MemberLeaderboard from "./components/member-leaderboard";
import TaskStatusChart from "./components/task-status-chart";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Member } from "@/lib/schema/MemberSchema";

export default function Analytics({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;

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
    data: members,
    isLoading: membersIsLoading,
    error: membersError,
  } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => fetchProjectMembers(projectId),
    enabled: !!projectId,
  });

  const {
    data: tasks = [],
    isLoading: tasksIsLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: () => fetchProjectTasks(projectId),
    enabled: !!projectId,
  });

  return (
    <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
      <div className="text-2xl font-bold tracking-tight">Analytics</div>
      <div className="w-full grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
        <MemberLeaderboard tasks={tasks} />
        <TaskStatusChart tasks={tasks} />
      </div>
    </main>
  );
}
