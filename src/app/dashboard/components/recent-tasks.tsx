"use client";

import { UserTask } from "@/lib/schema/TaskSchema";
import format from "date-fns/format";
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

type Props = {
  tasks: UserTask[];
};

export default function RecentTasks({ tasks }: Props) {
  const recentTasks = tasks
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <>
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
          {recentTasks.length === 0 ? (
            <div className="mx-auto flex flex-col items-center justify-center text-center py-14">
              <TbPlaylistX className="h-14 w-14 text-muted-foreground" />

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
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTasks.map((task) => {
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
          )}
        </CardContent>
      </Card>
    </>
  );
}
