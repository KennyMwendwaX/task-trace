"use client";

import { TableColumns } from "@/components/table/TableColumns";
import TaskTable from "@/components/table/TaskTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Task = {
  id: string;
  name: string;
  label: string;
  status: string;
  priority: string;
  description: string;
  assignedTo: string;
  due_date: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function Tasks() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get("/api/tasks");
      return data.tasks as Task[];
    },
  });

  const tasks = data?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <div className="container mx-auto mt-4 px-12 pb-5 pt-12">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <div className="text-2xl font-bold tracking-tight">
              Welcome back!
            </div>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks!
            </p>
          </div>
        </div>
        {tasks && tasks.length > 0 ? (
          <TaskTable data={tasks} columns={TableColumns} />
        ) : (
          <div>No tasks available</div>
        )}
      </div>
    </>
  );
}
