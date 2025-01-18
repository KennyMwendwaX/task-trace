import { redirect } from "next/navigation";
import TaskContent from "./components/task-content";
import { auth } from "@/auth";

type Params = { params: Promise<{ projectId: string }> };

export default async function Task({ params }: Params) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  const { projectId } = await params;

  return <TaskContent projectId={projectId} />;
}
