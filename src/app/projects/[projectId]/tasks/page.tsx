"use client";

import TaskTable from "./components/task-table/table";
import { TableColumns } from "./components/task-table/table-columns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ProjectTask } from "@/lib/schema/TaskSchema";
import Loading from "@/components/loading";
import AddTaskModal from "@/components/AddTaskModal";
import { TbPlaylistX } from "react-icons/tb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Member } from "@/lib/schema/MemberSchema";
import { membersData } from "../components/members";
import { tasksData } from "../components/tasks";
import { projectData } from "../components/project";

export default function Tasks({ params }: { params: { projectId: string } }) {
  const projectId = params.projectId;

  // const {
  //   data: tasksData,
  //   isLoading: tasksIsLoading,
  //   error: tasksError,
  // } = useQuery({
  //   queryKey: ["project-tasks", projectId],
  //   queryFn: async () => {
  //     const { data } = await axios.get(`/api/projects/${projectId}/tasks`);
  //     return data.tasks as ProjectTask[];
  //   },
  // });

  // const {
  //   data: membersData,
  //   isLoading: membersIsLoading,
  //   error: membersError,
  // } = useQuery({
  //   queryKey: ["project-members", projectId],
  //   queryFn: async () => {
  //     const { data } = await axios.get(`/api/projects/${projectId}/members`);
  //     return data.members as Member[];
  //   },
  // });

  // const tasks =
  //   tasksData
  //     ?.map((task) => ({
  //       ...task,
  //       dueDate: new Date(task.dueDate),
  //       createdAt: new Date(task.createdAt),
  //     }))
  //     .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) || [];

  // const tasksDone = tasks.filter((task) => task.status === "DONE");
  // const tasksTodo = tasks.filter((task) => task.status === "TO_DO");
  // const tasksInProgress = tasks.filter((task) => task.status === "IN_PROGRESS");
  // const tasksCanceled = tasks.filter((task) => task.status === "CANCELED");

  // const members = membersData || [];

  // const isLoading =
  //   membersIsLoading || tasksIsLoading;

  // if (isLoading) {
  //   return (
  //     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 lg:ml-[260px]">
  //       <Loading />
  //     </main>
  //   );
  // }

  const project = projectData;
  const members = membersData.map((member) => ({
    ...member,
    createdAt: new Date(member.createdAt),
    updatedAt: new Date(member.updatedAt),
    tasks: member.tasks.map((task) => ({
      ...task,
      dueDate: new Date(task.dueDate),
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    })),
  })) as Member[];

  const tasks = tasksData.map((task) => ({
    ...task,
    dueDate: new Date(task.dueDate),
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
  })) as ProjectTask[];

  const tasksDone = tasks.filter((task) => task.status === "DONE");
  const tasksTodo = tasks.filter((task) => task.status === "TO_DO");
  const tasksInProgress = tasks.filter((task) => task.status === "IN_PROGRESS");
  const tasksCanceled = tasks.filter((task) => task.status === "CANCELED");

  return (
    <>
      <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
        <div className="text-2xl font-bold tracking-tight">
          {project.name} Tasks
        </div>
        {tasks && tasks.length > 0 ? (
          <>
            <div className="text-lg text-muted-foreground">
              Here&apos;s a list of your project tasks!
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
                  <TaskTable
                    data={tasks}
                    columns={TableColumns({ projectId })}
                    members={members}
                    projectId={projectId}
                  />
                </div>
              </TabsContent>
              <TabsContent value="done">
                <div className="pt-4">
                  <TaskTable
                    data={tasksDone}
                    columns={TableColumns({ projectId })}
                    members={members}
                    projectId={projectId}
                  />
                </div>
              </TabsContent>
              <TabsContent value="todo">
                <div className="pt-4">
                  <TaskTable
                    data={tasksTodo}
                    columns={TableColumns({ projectId })}
                    members={members}
                    projectId={projectId}
                  />
                </div>
              </TabsContent>
              <TabsContent value="inprogress">
                <div className="pt-4">
                  <TaskTable
                    data={tasksInProgress}
                    columns={TableColumns({ projectId })}
                    members={members}
                    projectId={projectId}
                  />
                </div>
              </TabsContent>
              <TabsContent value="canceled">
                <div className="pt-4">
                  <TaskTable
                    data={tasksCanceled}
                    columns={TableColumns({ projectId })}
                    members={members}
                    projectId={projectId}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[520px]">
            <div className="flex flex-col items-center gap-1 text-center">
              <TbPlaylistX className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">No tasks added</h3>
              <p className="mb-4 mt-2 text-base text-muted-foreground">
                You have not added any tasks. Add one below.
              </p>
              <AddTaskModal projectId={projectId} members={members} />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
