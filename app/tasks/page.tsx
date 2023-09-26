import { TableColumns } from "@/components/TableColumns";
import TaskTable from "@/components/TaskTable";
import { tasks } from "@/data/tasks";

export default function Issues() {
  return (
    <>
      <div className="container mx-auto mt-4 px-5 pb-5 pt-12">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <TaskTable data={tasks} columns={TableColumns} />
      </div>
    </>
  );
}
