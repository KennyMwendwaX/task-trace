import { redirect } from "next/navigation";
import TaskContent from "./components/task-content";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getProject } from "@/server/api/project/project";
import { getProjectTask } from "@/server/api/project/tasks";
import { tryCatch } from "@/lib/try-catch";
import ProjectNotFound from "../../components/project-not-found";
import TaskNotFound from "./components/task-not-found";

type Params = { params: Promise<{ projectId: string }> };

export default async function Task({ params }: Params) {
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

  const { data: task, error: taskError } = await tryCatch(
    getProjectTask(projectId, session.user.id)
  );

  if (projectError) {
    throw new Error("Failed to fetch project");
  }

  if (taskError) {
    throw new Error("Failed to fetch task");
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  if (!task) {
    return <TaskNotFound projectId={project.id} />;
  }

  return <TaskContent project={project} task={task} />;
}
