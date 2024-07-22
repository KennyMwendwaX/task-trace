"use client";

import { ProjectTask } from "@/lib/schema/TaskSchema";
import { tasksData } from "../components/tasks";
import MemberLeaderboard from "./components/member-leaderboard";
import TaskStatusChart from "./components/task-status-chart";

export default function Analytics() {
  const tasks = tasksData.map((task) => ({
    ...task,
    dueDate: new Date(task.dueDate),
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
  })) as ProjectTask[];

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
