"use client";

import { TableColumns } from "@/components/table/TableColumns";
import TaskTable from "@/components/table/TaskTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Task } from "@/lib/schema";
import Loading from "@/components/Loading";
import AddTaskModal from "@/components/AddTaskModal";
import { MdOutlineAddTask } from "react-icons/md";

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
        {isLoading ? (
          <Loading />
        ) : (
          <>
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
                  <TaskTable data={tasks} columns={TableColumns} />
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center pt-36">
                  <MdOutlineAddTask className="h-14 w-14 text-muted-foreground" />

                  <h3 className="mt-4 text-2xl font-semibold">
                    No tasks added
                  </h3>
                  <p className="mb-4 mt-2 text-lg text-muted-foreground">
                    You have not added any tasks. Add one below.
                  </p>
                  <AddTaskModal />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
