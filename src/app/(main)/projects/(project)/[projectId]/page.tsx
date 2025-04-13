import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProjectContent from "./components/project-content";
import { getProjectMembers } from "@/server/api/project/members";
import { getProjectTasks } from "@/server/api/project/tasks";
import { getProject } from "@/server/api/project/project";
import ProjectNotFound from "./components/project-not-found";
import { tryCatch } from "@/lib/try-catch";
import JoinProjectModal from "./components/join-project-modal";
import { ProjectActionError } from "@/lib/errors";

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

  const { data: project, error: projectError } = await tryCatch(
    getProject(projectId, session.user.id)
  );

  if (projectError instanceof ProjectActionError) {
    switch (projectError.type) {
      case "NOT_FOUND":
        return <ProjectNotFound />;
      case "UNAUTHORIZED":
        return <JoinProjectModal projectId={projectId} session={session} />;
      case "DATABASE_ERROR":
      default:
        // Custom error handling instead of throwing
        return (
          <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Database Error
            </h2>
            <p className="text-gray-700">
              There was a problem accessing this project's data.
            </p>
            <p className="text-sm text-gray-500 mt-2">{projectError.message}</p>
          </div>
        );
    }
  }

  // Only fetch additional data if we have a valid project
  const [membersResult, tasksResult] = await Promise.all([
    tryCatch(getProjectMembers(projectId, session.user.id)),
    tryCatch(getProjectTasks(projectId, session.user.id)),
  ]);

  const { data: members, error: membersError } = membersResult;
  const { data: tasks, error: tasksError } = tasksResult;

  if (!project) {
    return <ProjectNotFound />;
  }

  // Handle other potential errors
  if (membersError || tasksError) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">
          Data Loading Error
        </h2>
        <p className="text-gray-700">
          {membersError ? "Unable to load team members. " : ""}
          {tasksError ? "Unable to load project tasks. " : ""}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {membersError?.message || tasksError?.message}
        </p>
      </div>
    );
  }

  return <ProjectContent project={project} members={members} tasks={tasks} />;
}
