import DashboardContent from "./components/dashboard-content";
import { redirect } from "next/navigation";
import { getUserTasks } from "@/server/api/user/tasks";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const result = await getUserTasks(session.user.id);

  if (result.error) {
    throw new Error(result.error.message);
  }

  const tasks = result.data ?? [];
  return <DashboardContent userName={session.user.name} tasks={tasks} />;
}
