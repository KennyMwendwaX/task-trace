import { auth } from "@/auth";
import { redirect } from "next/navigation";
import StoreInitializer from "./components/store-initializer";
import { getProject } from "@/server/actions/project/project";
import { getProjectMembers } from "@/server/actions/project/members";
import { getProjectTasks } from "@/server/actions/project/tasks";

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
  const membersResult = await getProjectMembers(projectId, session.user.id);
  const tasksResult = await getProjectTasks(projectId, session.user.id);

  if (projectResult.error) {
    throw new Error(projectResult.error.message);
  }

  if (membersResult.error) {
    throw new Error(membersResult.error.message);
  }

  if (tasksResult.error) {
    throw new Error(tasksResult.error.message);
  }

  const project = projectResult.data;
  const members = membersResult.data ?? [];
  const tasks = tasksResult.data ?? [];

  if (!project) {
    throw new Error("Project not found");
  }

  return (
    <StoreInitializer project={project} members={members} tasks={tasks}>
      {children}
    </StoreInitializer>
  );
}
