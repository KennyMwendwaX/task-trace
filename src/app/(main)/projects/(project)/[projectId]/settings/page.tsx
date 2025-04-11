import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SettingsContent from "./components/settings-content";
import { getProjectInvitationCode } from "@/server/api/project/invitation-code";
import { tryCatch } from "@/lib/try-catch";
import { getProject } from "@/server/api/project/project";
import ProjectNotFound from "../components/project-not-found";

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

  const { data: invitationCode, error: invitationCodeError } = await tryCatch(
    getProjectInvitationCode(projectId, session.user.id)
  );

  if (projectError) {
    throw new Error("Failed to fetch project");
  }

  if (invitationCodeError) {
    throw new Error("Failed to fetch invitation code");
  }

  if (!project) {
    <ProjectNotFound />;
  }

  return <SettingsContent project={project} invitationCode={invitationCode} />;
}
