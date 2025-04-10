import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProjectContent from "./components/project-content";
import { getProjectMembers } from "@/server/api/project/members";
import { getProjectTasks } from "@/server/api/project/tasks";
import { getProject } from "@/server/api/project/project";
import ProjectNotFound from "./components/project-not-found";

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

  const projectResult = await getProject(projectId, session.user.id);
  const membersResult = await getProjectMembers(projectId, session.user.id);
  const tasksResult = await getProjectTasks(projectId, session.user.id);

  if (projectResult.error || membersResult.error || tasksResult.error) {
    throw new Error("Failed to fetch project data");
  }

  const project = projectResult.data;
  const members = membersResult.data ?? [];
  const tasks = tasksResult.data ?? [];

  if (!project) {
    return <ProjectNotFound />;
  }

  return <ProjectContent project={project} members={members} tasks={tasks} />;
}
