"use client";

import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddProjectModal from "@/components/AddProjectModal";
import JoinProjectModal from "@/components/join-project-modal";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { UserTask } from "@/lib/schema/TaskSchema";
import axios from "axios";
import { priorities } from "@/lib/config";
import { GoTasklist } from "react-icons/go";
import TaskOverview from "./components/task-overview";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loading from "./components/loading";
import { TbChartBarOff } from "react-icons/tb";

interface StatusCounts {
  [key: string]: number;
}
interface StatusColors {
  [key: string]: string;
}

export default function Dashboard() {
  const session = useSession();

  const userId = session.data?.user?.id;

  const {
    data: tasksData,
    isLoading: tasksIsLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["user-tasks", userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${userId}/tasks`);
      return data.tasks as UserTask[];
    },
  });
  const tasks = tasksData || [];

  const statusCounts: StatusCounts = {};
  tasks.forEach((task) => {
    const status = task.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const statusText: Record<string, string> = {
    DONE: "Done",
    TO_DO: "Todo",
    IN_PROGRESS: "In Progress",
    CANCELED: "Canceled",
  };

  const statusChartData = Object.keys(statusCounts).map((status) => ({
    status: statusText[status],
    tasks: statusCounts[status],
  }));

  if (tasksIsLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex items-center">
        <div className="text-2xl font-bold tracking-tight">
          Welcome, {session.data?.user?.name}!
        </div>
        <div className="ml-auto flex items-center gap-2">
          <JoinProjectModal />
          <AddProjectModal />
        </div>
      </div>

      <div className="mt-4">
        <TaskOverview tasks={tasks} />
      </div>
      <div className="grid gap-4 md:gap-4 lg:grid-cols-2 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-xl">Tasks Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {tasks.length === 0 ? (
              <div className="mx-auto flex flex-col items-center justify-center text-center pt-16">
                <TbChartBarOff className="h-12 w-12 text-muted-foreground" />

                <h3 className="mt-4 text-xl font-semibold">
                  Tasks chart not available
                </h3>
                <p className="mb-4 mt-2 text-base text-muted-foreground">
                  You do not have any tasks.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={statusChartData}>
                  <XAxis
                    dataKey="status"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey="tasks"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle className="text-xl">Recent Tasks</CardTitle>
              <CardDescription>
                Recent tasks assigned to you from your projects.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/tasks">
                View All
                <LuArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="mx-auto flex flex-col items-center justify-center text-center pt-16">
                <GoTasklist className="h-12 w-12 text-muted-foreground" />

                <h3 className="mt-4 text-xl font-semibold">No tasks found</h3>
                <p className="mb-4 mt-2 text-base text-muted-foreground">
                  You do not have any tasks.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead className="text-right">Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => {
                    const priority = priorities.find(
                      (priority) => priority.value === task.priority
                    );
                    if (!priority) return null;
                    return (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium hover:underline cursor-pointer">
                          {task.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end">
                            {priority.value === "HIGH" ? (
                              <priority.icon className="mr-1 h-5 w-5 text-muted-foreground text-red-600" />
                            ) : priority.value === "MEDIUM" ? (
                              <priority.icon className="mr-1 h-5 w-5 text-muted-foreground text-orange-500" />
                            ) : priority.value === "LOW" ? (
                              <priority.icon className="mr-1 h-5 w-5 text-muted-foreground text-blue-600" />
                            ) : null}
                            <span>{task.priority}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
