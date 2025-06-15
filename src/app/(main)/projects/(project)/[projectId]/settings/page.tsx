import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SettingsContent from "./components/settings-content";
import { getProjectInvitationCode } from "@/server/actions/project/invitation-code";
import { tryCatch } from "@/lib/try-catch";
import { getProject } from "@/server/actions/project/project";
import ProjectNotFound from "../components/project-not-found";
import { ProjectActionError } from "@/lib/errors";
import { ServerError } from "../components/server-error";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Settings({ params }: Props) {
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

  const { data: invitationCode, error: invitationCodeError } = await tryCatch(
    getProjectInvitationCode(projectId, session.user.id)
  );

  if (invitationCodeError) {
    return (
      <ServerError
        title="Invitation Code Error"
        message="There was a problem accessing the invitation code."
        details={invitationCodeError.message}
        returnPath="/dashboard"
      />
    );
  }

  return <SettingsContent project={project} invitationCode={invitationCode} />;
}
