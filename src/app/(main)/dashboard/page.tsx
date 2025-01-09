import DashboardContent from "./components/dashboard-content";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserTasks } from "./actions";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const result = await getUserTasks(session.user.id);

  if (result.error) {
    throw new Error(result.error);
  }

  const tasks = result.data ?? [];
  return <DashboardContent userName={session.user.name} tasks={tasks} />;
}
