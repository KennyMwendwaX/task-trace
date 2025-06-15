import { TbPlaylistX } from "react-icons/tb";
import TaskTable from "./task-table/table";
import { TableColumns } from "./task-table/table-columns";
import { Task } from "@/server/database/schema";

interface TasksContentProps {
  tasks: Task[];
}

export default function TasksContent({ tasks }: TasksContentProps) {
  return (
    <>
      {tasks.length > 0 ? (
        <>
          <div className="text-2xl font-bold tracking-tight">My Tasks</div>
          <div className="text-lg text-muted-foreground">
            Here&apos;s a list of your tasks from your member projects!
          </div>
          <div className="pt-4">
            <TaskTable data={tasks} columns={TableColumns} />
          </div>
        </>
      ) : (
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center pt-36">
          <TbPlaylistX className="h-14 w-14 text-muted-foreground" />

          <h3 className="mt-4 text-2xl font-semibold">No tasks found</h3>
          <p className="mb-4 mt-2 text-lg text-muted-foreground">
            You do not have any tasks.
          </p>
        </div>
      )}
    </>
  );
}
