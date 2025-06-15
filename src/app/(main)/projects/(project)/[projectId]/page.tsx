import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProjectContent from "./components/project-content";
import { getProjectMembers } from "@/server/actions/project/members";
import { getProjectTasks } from "@/server/actions/project/tasks";
import { getProject } from "@/server/actions/project/project";
import ProjectNotFound from "./components/project-not-found";
import { tryCatch } from "@/lib/try-catch";
import { ProjectActionError } from "@/lib/errors";
import { ServerError } from "./components/server-error";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectPage({ params }: Props) {
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

  // Handle project not found or not authorized
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

  // Only fetch additional data if we have a valid project
  const [membersResult, tasksResult] = await Promise.all([
    tryCatch(getProjectMembers(projectId, session.user.id)),
    tryCatch(getProjectTasks(projectId, session.user.id)),
  ]);

  const { data: members, error: membersError } = membersResult;
  const { data: tasks, error: tasksError } = tasksResult;

  // Handle other potential errors with ServerError component
  if (membersError || tasksError) {
    const errorMessage = [
      membersError ? "Unable to load team members." : "",
      tasksError ? "Unable to load project tasks." : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <ServerError
        title="Data Loading Error"
        message={errorMessage}
        details={membersError?.message || tasksError?.message}
        returnPath="/dashboard"
      />
    );
  }

  return <ProjectContent project={project} members={members} tasks={tasks} />;
}
