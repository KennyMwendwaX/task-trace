import { auth } from "@/auth";
import Loading from "./loading";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import TasksContent from "./components/tasks-content";

export default async function UserTasks() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <Suspense fallback={<Loading />}>
      <TasksContent userId={session.user.id} />
    </Suspense>
  );
}
