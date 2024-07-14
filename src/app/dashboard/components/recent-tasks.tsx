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
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">Recent Tasks</CardTitle>
            <Link href="/tasks">
              <Button variant="default" size="sm">
                View All
                <LuArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <CardDescription>
            Recent tasks assigned to you from your projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <TbPlaylistX className="h-8 w-8 mb-4" />
              <h3 className="font-semibold text-center">No tasks found</h3>
              <p className="text-sm text-center">You do not have any tasks.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Due Date
                    </TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTasks.map((task) => {
                    const priority = priorities.find(
                      (priority) => priority.value === task.priority
                    );
                    if (!priority) return null;
                    const dueDate = format(task.dueDate, "dd/MM/yyyy");
                    return (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium hover:underline cursor-pointer">
                          <Link
                            href={`/projects/${task.projectId}/tasks/${task.id}`}>
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
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
