import DashboardContent from "./components/dashboard-content";
import { redirect } from "next/navigation";
import { getUserTasks } from "@/server/actions/user/tasks";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { tryCatch } from "@/lib/try-catch";

export default async function Dashboard() {
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

  return <DashboardContent session={session} tasks={tasks} />;
}
