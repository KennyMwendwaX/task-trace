import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getProjectMembers, getProjectTasks } from "./actions";
import ProjectContent from "./components/project-content";

type Props = {
  params: {
    projectId: string;
  };
};

export default async function ProjectPage({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const { projectId } = params;

  const membersResult = await getProjectMembers(projectId, session.user.id);
  const tasksResult = await getProjectTasks(projectId, session.user.id);

  if (membersResult.error) {
    throw new Error(membersResult.error);
  }

  if (tasksResult.error) {
    throw new Error(tasksResult.error);
  }

  const members = membersResult.data ?? [];
  const tasks = tasksResult.data ?? [];

  return (
    <ProjectContent projectId={projectId} members={members} tasks={tasks} />
  );
}
