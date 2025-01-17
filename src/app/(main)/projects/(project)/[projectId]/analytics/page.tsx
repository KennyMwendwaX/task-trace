import { getProject, getProjectTasks } from "../actions";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import AnalyticsContent from "./components/analytics-content";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Analytics({ params }: Props) {
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

  return <AnalyticsContent projectId={projectId} tasks={tasks} />;
}
