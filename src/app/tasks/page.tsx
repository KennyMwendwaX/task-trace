"use client";

import TaskTable from "@/components/tables/UserTaskTable/TaskTable";
import tasksData from "./tasks.json";
import { TableColumns } from "@/components/tables/UserTaskTable/TableColumns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTask } from "@/lib/schema/TaskSchema";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/auth";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function UserTasks() {
  const session = useSession();

  const userId = session.data?.user?.id;

  const {
    data: tasksData,
    isLoading: tasksIsLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["user-tasks"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${userId}/tasks`);
      return data.tasks as UserTask[];
    },
  });
  const tasks =
    tasksData
      ?.map((task) => ({
        ...task,
        due_date: new Date(task.due_date),
        createdAt: new Date(task.createdAt),
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) || [];

  const tasksDone = tasks.filter((task) => task.status === "DONE");
  const tasksTodo = tasks.filter((task) => task.status === "TO_DO");
  const tasksInProgress = tasks.filter((task) => task.status === "IN_PROGRESS");
  const tasksCanceled = tasks.filter((task) => task.status === "CANCELED");
  return (
    <>
      <div className="text-2xl font-bold tracking-tight">Tasks Page</div>

      <div className="text-lg text-muted-foreground">
        Here&apos;s a list of your tasks from your member projects!
      </div>

      <Tabs defaultValue="all" className="pt-2">
        <TabsList className="grid grid-cols-5 w-[600px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
          <TabsTrigger value="todo">Todo</TabsTrigger>
          <TabsTrigger value="inprogress">In Progress</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="pt-4">
            <TaskTable data={tasks} columns={TableColumns} />
          </div>
        </TabsContent>
        <TabsContent value="done">
          <div className="pt-4">
            <TaskTable data={tasksDone} columns={TableColumns} />
          </div>
        </TabsContent>
        <TabsContent value="todo">
          <div className="pt-4">
            <TaskTable data={tasksTodo} columns={TableColumns} />
          </div>
        </TabsContent>
        <TabsContent value="inprogress">
          <div className="pt-4">
            <TaskTable data={tasksInProgress} columns={TableColumns} />
          </div>
        </TabsContent>
        <TabsContent value="canceled">
          <div className="pt-4">
            <TaskTable data={tasksCanceled} columns={TableColumns} />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
