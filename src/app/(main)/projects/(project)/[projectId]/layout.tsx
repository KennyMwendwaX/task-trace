import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getProject, getProjectMembers, getProjectTasks } from "./actions";
import StoreInitializer from "./components/store-initializer";

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
    throw new Error(projectResult.error);
  }

  if (membersResult.error) {
    throw new Error(membersResult.error);
  }

  if (tasksResult.error) {
    throw new Error(tasksResult.error);
  }

  const project = projectResult.data;
  const members = membersResult.data ?? [];
  const tasks = tasksResult.data ?? [];

  if (!project) {
    notFound();
  }

  return (
    <StoreInitializer project={project} members={members} tasks={tasks}>
      {children}
    </StoreInitializer>
  );
}
