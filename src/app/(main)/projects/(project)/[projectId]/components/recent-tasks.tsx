"use client";

import { format } from "date-fns/format";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LuArrowUpRight } from "react-icons/lu";
import { priorities } from "@/lib/config";
import { TbPlaylistX } from "react-icons/tb";
import { Task } from "@/database/schema";

type Props = {
  projectId: number;
  tasks: Task[];
};

export default function RecentTasks({ projectId, tasks }: Props) {
  const recentTasks = tasks
    .map((task) => ({
      ...task,
      dueDate: new Date(task.dueDate),
      createdAt: new Date(task.createdAt),
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Recent Tasks</CardTitle>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href={`/projects/${projectId}/tasks`}>
              View All
              <LuArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <CardDescription>Tasks recently added to the project.</CardDescription>
      </CardHeader>
      <CardContent>
        {recentTasks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTasks.map((task) => {
                const priority = priorities.find(
                  (priority) => priority.value === task.priority
                );
                if (!priority) return null;
                const dueDate = format(task.dueDate, "MMM dd, yyyy");
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium hover:underline cursor-pointer">
                      <Link href={`/projects/${projectId}/tasks/${task.id}`}>
                        {task.name}
                      </Link>
                    </TableCell>
                    <TableCell>{dueDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
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
        ) : (
          <div className="mx-auto flex flex-col items-center justify-center text-center pt-16">
            <TbPlaylistX className="h-14 w-14 text-muted-foreground" />

            <h3 className="mt-4 text-xl font-semibold">No tasks found</h3>
            <p className="mb-4 mt-2 text-base text-muted-foreground">
              There are no tasks in the project.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
