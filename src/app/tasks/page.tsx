"use client";

import TaskTable from "./components/task-table/table";
import { TableColumns } from "./components/task-table/table-columns";
import { UserTask } from "@/lib/schema/TaskSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { TbPlaylistX } from "react-icons/tb";
import Loading from "./components/loading";

export default function UserTasks() {
  const session = useSession();

  const userId = session.data?.user?.id;

  const fetchUserTasks = async (
    userId: string | undefined
  ): Promise<UserTask[]> => {
    if (!userId) throw new Error("User ID not found");
    const { data } = await axios.get(`/api/users/${userId}/tasks`);
    return data.tasks
      .map((task: UserTask) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : null,
      }))
      .sort(
        (a: UserTask, b: UserTask) =>
          b.createdAt.getTime() - a.createdAt.getTime()
      );
  };

  const {
    data: tasks = [],
    isLoading: tasksIsLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["user-tasks", userId],
    queryFn: () => fetchUserTasks(userId),
    enabled: !!userId,
  });

  return (
    <>
      {tasksIsLoading ? (
        <Loading />
      ) : (
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
      )}
    </>
  );
}
