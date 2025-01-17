import { auth } from "@/auth";
import { getTask } from "../actions";
import { getProjectMembers } from "../../../actions";
import EditTaskForm from "./components/edit-task-form";
import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ projectId: string; taskId: string }> };

export default async function EditTaskPage({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const { projectId, taskId } = await params;

  const taskResult = await getTask(projectId, taskId, session.user.id);
  const membersResult = await getProjectMembers(projectId, session.user.id);

  if (taskResult.error) {
    throw new Error(taskResult.error);
  }

  if (membersResult.error) {
    throw new Error(membersResult.error);
  }

  const task = taskResult.data;

  if (!task) {
    notFound();
  }

  const members = membersResult.data ?? [];

  return <EditTaskForm projectId={projectId} task={task} members={members} />;
}
