import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AnalyticsContent from "./components/analytics-content";
import { getProject } from "@/server/api/project/project";
import { getProjectTasks } from "@/server/api/project/tasks";
import { tryCatch } from "@/lib/try-catch";
import ProjectNotFound from "../components/project-not-found";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Analytics({ params }: Props) {
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
  // const { data: members, error: membersError } = await tryCatch(
  //   getProjectMembers(projectId, session.user.id)
  // );
  const { data: tasks, error: tasksError } = await tryCatch(
    getProjectTasks(projectId, session.user.id)
  );

  if (projectError) {
    throw new Error("Failed to fetch project");
  }

  // if (membersError) {
  //   throw new Error("Failed to fetch members");
  // }

  if (tasksError) {
    throw new Error("Failed to fetch tasks");
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  return <AnalyticsContent project={project} tasks={tasks} />;
}
