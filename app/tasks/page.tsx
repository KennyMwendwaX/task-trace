"use client";

import { TableColumns } from "@/components/table/TableColumns";
import TaskTable from "@/components/table/TaskTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Task } from "@/lib/schema/TaskSchema";
import Loading from "@/components/Loading";
import AddTaskModal from "@/components/AddTaskModal";
import { MdOutlineAddTask } from "react-icons/md";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Tasks() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get("/api/user/tasks");
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

  const tasksDone = tasks.filter((task) => task.status === "DONE");
  const tasksTodo = tasks.filter((task) => task.status === "TO_DO");
  const tasksInProgress = tasks.filter((task) => task.status === "IN_PROGRESS");

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
                      <TaskTable
                        data={tasksInProgress}
                        columns={TableColumns}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
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
