import AddProjectModal from "@/app/(main)/components/add-project-modal";
import TaskOverview from "./task-overview";
import RecentTasks from "./recent-tasks";
import TaskChart from "./task-chart";
import { Task } from "@/server/database/schema";
import { Session } from "@/lib/auth";

interface DashboardContentProps {
  session: Session;
  tasks: Task[];
}

export default async function DashboardContent({
  session,
  tasks,
}: DashboardContentProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="text-2xl font-bold tracking-tight mb-4 sm:mb-0">
          Welcome, {session.user.name}!
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
