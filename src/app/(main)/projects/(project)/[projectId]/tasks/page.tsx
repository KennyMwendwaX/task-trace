import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TasksContent from "./components/tasks-content";
import { getProject } from "@/server/api/project/project";
import { getProjectTasks } from "@/server/api/project/tasks";
import ProjectNotFound from "../components/project-not-found";
import { tryCatch } from "@/lib/try-catch";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Tasks({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  const { projectId } = await params;

  const { data: project, error: projectError } = await tryCatch(
    getProject(projectId, session.user.id)
  );

  const { data: tasks, error: tasksError } = await tryCatch(
    getProjectTasks(projectId, session.user.id)
  );

  if (projectError) {
    throw new Error("Failed to fetch project");
  }

  if (tasksError) {
    throw new Error("Failed to fetch tasks");
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  return <TasksContent project={project} tasks={tasks} />;
}
