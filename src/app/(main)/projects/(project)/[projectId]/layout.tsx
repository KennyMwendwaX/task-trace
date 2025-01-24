import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getProject } from "@/server/actions/project/project";
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
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
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
    return <JoinProjectModal projectId={projectId} />;
  }

  return <>{children}</>;
}
