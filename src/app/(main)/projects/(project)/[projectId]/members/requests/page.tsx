import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RequestsContent from "./components/requests-content";
import { getMembershipRequests } from "@/server/api/project/members";
import { tryCatch } from "@/lib/try-catch";
import { getProject } from "@/server/api/project/project";
import { ProjectActionError } from "@/lib/errors";
import { ServerError } from "../../components/server-error";
import ProjectNotFound from "../../components/project-not-found";

type Props = { params: Promise<{ projectId: string }> };

export default async function MembershipRequests({ params }: Props) {
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

  const { data: requests, error: requestsError } = await tryCatch(
    getMembershipRequests(projectId, session.user.id)
  );

  if (requestsError) {
    return (
      <ServerError
        title="Data Loading Error"
        message="Unable to load project membership requests."
        details={requestsError.message}
        returnPath={`/projects/${projectId}`}
      />
    );
  }

  return <RequestsContent project={project} requests={requests} />;
}
