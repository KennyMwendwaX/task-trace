import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TasksContent from "./components/tasks-content";
import { getUserTasks } from "@/server/api/user/tasks";
import { tryCatch } from "@/lib/try-catch";

export default async function UserTasks() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { data: tasks, error } = await tryCatch(getUserTasks(session.user.id));

  if (error) {
    throw new Error(error.message);
  }

  return <TasksContent tasks={tasks} />;
}
