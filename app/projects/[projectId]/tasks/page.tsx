"use client";

import TaskTable from "@/components/tables/TaskTable/TaskTable";
import { TableColumns } from "@/components/tables/TaskTable/TableColumns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Task } from "@/lib/schema/TaskSchema";
import Loading from "@/components/Loading";
import AddTaskModal from "@/components/AddTaskModal";
import { MdOutlineAddTask } from "react-icons/md";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Member } from "@/lib/schema/UserSchema";

export default function Tasks({ params }: { params: { projectId: string } }) {
  const projectId = params.projectId;
  console.log(projectId);

  const {
    data: tasksData,
    isLoading: tasksIsLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${projectId}/tasks`);
      return data.tasks as Task[];
    },
  });

  const {
    data: membersData,
    isLoading: membersIsLoading,
    error: membersError,
  } = useQuery({
    queryKey: ["members", projectId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${projectId}/members`);
      return data.members as Member[];
    },
  });

  const tasks =
    tasksData
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
  const tasksCanceled = tasks.filter((task) => task.status === "CANCELED");

  const members = membersData || [];

  return (
    <>
      <div className="container mx-auto mt-4 px-12 pb-5 pt-12">
        {tasksIsLoading ? (
          <Loading />
        ) : (
          <>
            {tasks && tasks.length > 0 ? (
              <>
                <div className="flex items-center justify-between space-y-2">
                  <div>
                    <div className="text-3xl font-bold tracking-tight">
                      Welcome back!
                    </div>
                    <div className="text-xl text-muted-foreground">
                      Here&apos;s a list of your tasks!
                    </div>
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
                  <TabsContent value="canceled">
                    <div className="pt-4">
                      <TaskTable data={tasksCanceled} columns={TableColumns} />
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
                  <AddTaskModal projectId={projectId} members={members} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
