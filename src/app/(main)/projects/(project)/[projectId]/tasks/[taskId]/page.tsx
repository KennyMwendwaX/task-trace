import { notFound, redirect } from "next/navigation";
import { getTask } from "./actions";
import TaskContent from "./components/task-content";
import { auth } from "@/auth";

type Params = { params: Promise<{ projectId: string; taskId: string }> };

export default async function Task({ params }: Params) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  const { projectId, taskId } = await params;

  const taskResult = await getTask(projectId, taskId, session.user.id);

  if (taskResult.error) {
    throw new Error(taskResult.error);
  }

  const task = taskResult.data;

  if (!task) {
    notFound();
  }

  return <TaskContent projectId={projectId} task={task} />;
}
