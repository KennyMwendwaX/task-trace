import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tasks } from "@/data/tasks";
import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export default function TaskOverview() {
  const tasksDone = tasks.filter((task) => task.status === "done");
  const tasks_done_percentage = (tasksDone.length / tasks.length) * 100;

  const tasksTodo = tasks.filter((task) => task.status === "todo");
  const tasks_todo_percentage = (tasksTodo.length / tasks.length) * 100;

  const tasksInProgress = tasks.filter((task) => task.status === "in progress");
  const tasks_inProgress_percentage =
    (tasksInProgress.length / tasks.length) * 100;

  const tasksCanceled = tasks.filter((task) => task.status === "done");
  const tasks_canceled_percentage = (tasksCanceled.length / tasks.length) * 100;

  const tasksBacklog = tasks.filter((task) => task.status === "done");
  const tasks_backlog_percentage = (tasksBacklog.length / tasks.length) * 100;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-slate-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Done</CardTitle>
            <CheckCircledIcon className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksDone.length}</div>
            <p className="text-xs text-muted-foreground">
              {tasks_done_percentage}% of all tasks
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Todo</CardTitle>
            <CircleIcon className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksTodo.length}</div>
            <p className="text-xs text-muted-foreground">
              {tasks_todo_percentage}% of all tasks
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <StopwatchIcon className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksInProgress.length}</div>
            <p className="text-xs text-muted-foreground">
              {tasks_inProgress_percentage}% of all tasks
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceled</CardTitle>
            <CrossCircledIcon className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksCanceled.length}</div>
            <p className="text-xs text-muted-foreground">
              {tasks_canceled_percentage}% of all tasks
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backlog</CardTitle>
            <QuestionMarkCircledIcon className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksBacklog.length}</div>
            <p className="text-xs text-muted-foreground">
              {tasks_backlog_percentage}% of all tasks
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
