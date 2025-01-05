import AddProjectModal from "@/components/add-project-modal";
import TaskOverview from "./task-overview";
import RecentTasks from "./recent-tasks";
import TaskChart from "./task-chart";
import { getUserTasks } from "../actions";

interface DashboardContentProps {
  userId?: string;
  userName?: string | null;
}

export default async function DashboardContent({
  userId,
  userName,
}: DashboardContentProps) {
  const result = await getUserTasks(userId);

  if (result.error) {
    throw new Error(result.error);
  }

  const tasks = result.data ?? [];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="text-2xl font-bold tracking-tight mb-4 sm:mb-0">
          Welcome, {userName}!
        </div>
        <AddProjectModal />
      </div>

      <div className="mt-4">
        <TaskOverview tasks={tasks} />
      </div>

      <div className="w-full grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
        <TaskChart tasks={tasks} />
        <RecentTasks tasks={tasks} />
      </div>
    </>
  );
}
