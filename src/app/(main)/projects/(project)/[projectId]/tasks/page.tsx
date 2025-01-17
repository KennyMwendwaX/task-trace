import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getProjectTasks } from "../actions";
import TasksContent from "./components/tasks-content";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Tasks({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  const { projectId } = await params;

  const tasksResult = await getProjectTasks(projectId, session.user.id);

  if (tasksResult.error) {
    throw new Error(tasksResult.error);
  }

  const tasks = tasksResult.data ?? [];

  return <TasksContent projectId={projectId} tasks={tasks} />;
}
