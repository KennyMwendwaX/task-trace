"use client";

import { TableColumns } from "@/components/table/TableColumns";
import TaskTable from "@/components/table/TaskTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Task } from "@/lib/schema";
import Loading from "@/components/Loading";
import AddTaskModal from "@/components/AddTaskModal";

export default function Tasks() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get("/api/tasks");
      return data.tasks as Task[];
    },
  });

  const tasks =
    data
      ?.map((task) => ({
        ...task,
        due_date: new Date(task.due_date),
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) || [];

  return (
    <>
      <div className="container mx-auto mt-4 px-12 pb-5 pt-12">
        {data && data.length > 0 ? (
          <>
            <div className="flex items-center justify-between space-y-2">
              <div>
                <div className="text-3xl font-bold tracking-tight">
                  Welcome back!
                </div>
                <p className="text-xl text-muted-foreground">
                  Here&apos;s a list of your tasks!
                </p>
              </div>
            </div>

            <div className="pt-4">
              {isLoading ? (
                <Loading />
              ) : (
                <>
                  <TaskTable data={tasks} columns={TableColumns} />
                </>
              )}
            </div>
          </>
        ) : (
          <>
            {/* <div className="flex">
                <AddTaskModal />
              </div>
              <div className="text-lg">No tasks available</div> */}
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-10 w-10 text-muted-foreground"
                viewBox="0 0 24 24">
                <circle cx="12" cy="11" r="1" />
                <path d="M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5ZM8 14a5 5 0 1 1 8 0" />
                <path d="M17 18.5a9 9 0 1 0-10 0" />
              </svg>

              <h3 className="mt-4 text-lg font-semibold">No tasks added</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                You have not added any tasks. Add one below.
              </p>
              <AddTaskModal />
            </div>
          </>
        )}
      </div>
    </>
  );
}
