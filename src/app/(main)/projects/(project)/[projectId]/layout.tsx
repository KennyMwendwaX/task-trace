import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getProject } from "@/server/api/project/project";
import ProjectNotFound from "./components/project-not-found";
import JoinProjectModal from "./components/join-project-modal";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    projectId: string;
  }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  const { projectId } = await params;
  const projectResult = await getProject(projectId, session.user.id);

  if (projectResult.error) {
    throw new Error("Failed to fetch project data");
  }

  const project = projectResult.data;

  if (!project) {
    return <ProjectNotFound />;
  }

  const isPrivateProject = !project.isPublic;
  const isNotMember = !project.member;

  if (isPrivateProject && isNotMember) {
    return <JoinProjectModal session={session} projectId={projectId} />;
  }

  return <>{children}</>;
}
