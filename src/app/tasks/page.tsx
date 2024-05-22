import TaskTable from "@/components/tables/UserTaskTable/TaskTable";
import tasksData from "./tasks.json";
import { TableColumns } from "@/components/tables/UserTaskTable/TableColumns";
import { UserTask } from "@/lib/schema/TaskSchema";

export default function UserTasks() {
  const tasks = tasksData?.map((task) => ({
    ...task,
    due_date: new Date(task.due_date),
    createdAt: new Date(task.createdAt),
  })) as UserTask[];
  return (
    <>
      <div className="text-2xl font-bold tracking-tight">Tasks Page</div>

      <div className="text-lg text-muted-foreground">
        Here&apos;s a list of your tasks from your member projects!
      </div>

      <TaskTable columns={TableColumns} data={tasks} />
    </>
  );
}
