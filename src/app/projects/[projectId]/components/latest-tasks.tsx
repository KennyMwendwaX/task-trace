"use client";

import { ProjectTask } from "@/lib/schema/TaskSchema";
import format from "date-fns/format";
import { IoChevronForward } from "react-icons/io5";
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
import { GoTasklist } from "react-icons/go";
import { priorities } from "@/lib/config";

type Props = {
  projectId: string;
  tasks: ProjectTask[];
};

export default function LatestTasks({ projectId, tasks }: Props) {
  const latestTasks = tasks
    .map((task) => ({
      ...task,
      due_date: new Date(task.due_date),
      createdAt: new Date(task.createdAt),
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle className="text-xl">Recent Tasks</CardTitle>
            <CardDescription>
              Tasks recently added to the project.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href={`/projects/${projectId}/tasks`}>
              View All
              <LuArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {latestTasks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestTasks.map((task) => {
                  const priority = priorities.find(
                    (priority) => priority.value === task.priority
                  );
                  const dueDate = format(task.due_date, "dd/MM/yyyy");
                  if (!priority) return null;
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium hover:underline cursor-pointer">
                        <Link
                          className="hover:underline"
                          href={`/projects/${projectId}/tasks/${task.id}`}>
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
              <GoTasklist className="h-12 w-12 text-muted-foreground" />

              <h3 className="mt-4 text-xl font-semibold">No tasks found</h3>
              <p className="mb-4 mt-2 text-base text-muted-foreground">
                You do not have any tasks.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
