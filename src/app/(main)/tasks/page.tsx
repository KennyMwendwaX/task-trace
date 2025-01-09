import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TasksContent from "./components/tasks-content";

export default async function UserTasks() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return <TasksContent userId={session.user.id} />;
}
