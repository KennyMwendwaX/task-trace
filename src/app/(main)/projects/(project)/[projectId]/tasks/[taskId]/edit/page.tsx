import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import EditTaskForm from "./components/edit-task-form";
import { redirect } from "next/navigation";
import { tryCatch } from "@/lib/try-catch";
import { getProject } from "@/server/actions/project/project";
import { getProjectTask } from "@/server/actions/project/tasks";
import { ProjectActionError, TaskActionError } from "@/lib/errors";
import ProjectNotFound from "../../../components/project-not-found";
import { ServerError } from "../../../components/server-error";
import TaskNotFound from "../components/task-not-found";
import { getProjectMembers } from "@/server/actions/project/members";

type Props = { params: Promise<{ projectId: string; taskId: string }> };

export default async function EditTaskPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { projectId, taskId } = await params;

  const { data: project, error: projectError } = await tryCatch(
    getProject(projectId, session.user.id)
  );

  const { data: task, error: taskError } = await tryCatch(
    getProjectTask(projectId, taskId)
  );

  const { data: members, error: membersError } = await tryCatch(
    getProjectMembers(projectId, session.user.id)
  );

  if (projectError instanceof ProjectActionError) {
    switch (projectError.type) {
      case "NOT_FOUND":
        return <ProjectNotFound />;
      default:
        return (
          <ServerError
            title="Project Access Error"
            message="There was a problem accessing this project's data."
            details={projectError.message}
            returnPath="/dashboard"
          />
        );
    }
  }

  if (taskError instanceof TaskActionError) {
    switch (taskError.type) {
      case "NOT_FOUND":
        return <TaskNotFound projectId={projectId} />;
      default:
        return (
          <ServerError
            title="Task Access Error"
            message="There was a problem accessing this task's data."
            details={taskError.message}
            returnPath={`/projects/${projectId}`}
            returnLabel="Return to Project"
          />
        );
    }
  }

  if (membersError) {
    return (
      <ServerError
        title="Data Loading Error"
        message="Unable to load project members."
        details={membersError.message}
        returnPath={`/projects/${projectId}`}
        returnLabel="Return to Project"
      />
    );
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  if (!task) {
    return <TaskNotFound projectId={projectId} />;
  }

  return <EditTaskForm project={project} task={task} members={members} />;
}
