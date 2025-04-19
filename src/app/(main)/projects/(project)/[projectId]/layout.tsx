import { auth } from "@/lib/auth";
import { ProjectActionError } from "@/lib/errors";
import { tryCatch } from "@/lib/try-catch";
import { checkProjectAccess } from "@/server/api/project/project";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProjectNotFound from "./components/project-not-found";
import { ServerError } from "./components/server-error";
import JoinPublicProjectModal from "./components/join-public-project-modal";
import JoinProjectModal from "./components/join-project-modal";

export const metadata: Metadata = {
  title: "Project Overview",
  description: "Project overview page",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Layout({ children, params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { projectId } = await params;

  const { data: accessInfo, error: accessError } = await tryCatch(
    checkProjectAccess(projectId, session.user.id)
  );

  if (accessError instanceof ProjectActionError) {
    if (accessError.type === "NOT_FOUND") {
      return <ProjectNotFound />;
    }

    return (
      <ServerError
        title="Access Check Error"
        message="Unable to check project access."
        details={accessError.message}
        returnPath="/dashboard"
      />
    );
  }

  if (!accessInfo) {
    return (
      <ServerError
        title="Data Error"
        message="Unable to retrieve project access information."
        details="The system couldn't determine your access to this project."
        returnPath="/dashboard"
      />
    );
  }

  if (!accessInfo.isMember) {
    if (accessInfo.isPublic) {
      return (
        <JoinPublicProjectModal
          projectId={projectId}
          projectName={accessInfo.projectName}
        />
      );
    } else {
      return (
        <JoinProjectModal
          projectId={projectId}
          session={session}
          hasPendingRequest={accessInfo.hasPendingRequest}
        />
      );
    }
  }

  return <>{children}</>;
}
