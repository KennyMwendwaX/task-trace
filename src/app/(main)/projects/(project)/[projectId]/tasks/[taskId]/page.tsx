import { redirect } from "next/navigation";
import TaskContent from "./components/task-content";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type Params = { params: Promise<{ projectId: string }> };

export default async function Task({ params }: Params) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  const { projectId } = await params;

  return <TaskContent projectId={projectId} />;
}
