import AddProjectModal from "@/components/add-project-modal";
import TaskOverview from "./task-overview";
import RecentTasks from "./recent-tasks";
import TaskChart from "./task-chart";
import { UserTask } from "@/lib/schema/TaskSchema";

interface DashboardContentProps {
  userName?: string | null;
  tasks: UserTask[];
}

export default async function DashboardContent({
  userName,
  tasks,
}: DashboardContentProps) {
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
