import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CreateTaskForm from "./components/create-task-form";
import { redirect } from "next/navigation";
import { getProjectMembers } from "@/server/actions/project/members";
import { getProject } from "@/server/actions/project/project";
import { tryCatch } from "@/lib/try-catch";
import ProjectNotFound from "../../components/project-not-found";
import { ProjectActionError } from "@/lib/errors";
import { ServerError } from "../../components/server-error";

type Props = { params: Promise<{ projectId: string }> };

export default async function CreateTaskPage({ params }: Props) {
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

  const { data: members, error: membersError } = await tryCatch(
    getProjectMembers(projectId, session.user.id)
  );

  if (membersError) {
    return (
      <ServerError
        title="Data Loading Error"
        message="Unable to load project members."
        details={membersError.message}
        returnPath={`/projects/${projectId}`}
        returnLabel="Return to Project"
      />
    );
  }

  return <CreateTaskForm project={project} members={members} />;
}
