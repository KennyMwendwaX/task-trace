"use client";

import { ProjectTask } from "@/lib/schema/TaskSchema";
import { tasksData } from "../components/tasks";
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
      <TaskStatusChart tasks={tasks} />
    </main>
  );
}
