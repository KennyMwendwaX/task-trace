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

  const projectResult = await getProject(projectId, session.user.id);
  const tasksResult = await getProjectTasks(projectId, session.user.id);

  if (projectResult.error) {
    throw new Error(projectResult.error);
  }

  if (tasksResult.error) {
    throw new Error(tasksResult.error);
  }

  const project = projectResult.data;
  const tasks = tasksResult.data ?? [];

  if (!project) {
    notFound();
  }

  return <AnalyticsContent projectId={projectId} tasks={tasks} />;
}
