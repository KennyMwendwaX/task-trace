import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TasksContent from "./components/tasks-content";
import { getProject } from "@/server/actions/project/project";
import { getProjectTasks } from "@/server/actions/project/tasks";
import ProjectNotFound from "../components/project-not-found";

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

  const projectResult = await getProject(projectId, session.user.id);
  const tasksResult = await getProjectTasks(projectId, session.user.id);

  if (projectResult.error || tasksResult.error) {
    throw new Error("Failed to fetch project data");
  }

  const project = projectResult.data;
  const tasks = tasksResult.data ?? [];

  if (!project) {
    return <ProjectNotFound />;
  }

  return <TasksContent project={project} tasks={tasks} />;
}
