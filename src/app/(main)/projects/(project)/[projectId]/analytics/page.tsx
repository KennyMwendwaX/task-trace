import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AnalyticsContent from "./components/analytics-content";
import { getProject } from "@/server/api/project/project";
import { getProjectTasks } from "@/server/api/project/tasks";
import { tryCatch } from "@/lib/try-catch";
import ProjectNotFound from "../components/project-not-found";
import { ProjectActionError } from "@/lib/errors";
import { ServerError } from "../components/server-error";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Analytics({ params }: Props) {
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

  if (projectError instanceof ProjectActionError) {
    switch (projectError.type) {
      case "NOT_FOUND":
        return <ProjectNotFound />;
      default:
        return (
          <ServerError
            title="Project Access Error"
            message="There was a problem accessing this project's data."
            details={projectError.message}
            returnPath="/dashboard"
          />
        );
    }
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  const { data: tasks, error: tasksError } = await tryCatch(
    getProjectTasks(projectId, session.user.id)
  );

  if (tasksError) {
    return (
      <ServerError
        title="Data Loading Error"
        message="Unable to load project tasks for analytics."
        details={tasksError.message}
        returnPath={`/projects/${projectId}`}
        returnLabel="Return to Project"
      />
    );
  }

  return <AnalyticsContent project={project} tasks={tasks} />;
}
