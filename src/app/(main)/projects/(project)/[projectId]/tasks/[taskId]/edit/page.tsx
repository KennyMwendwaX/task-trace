import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import EditTaskForm from "./components/edit-task-form";
import { redirect } from "next/navigation";

type Props = { params: Promise<{ projectId: string; taskId: string }> };

export default async function EditTaskPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { projectId, taskId } = await params;

  return <EditTaskForm projectId={projectId} taskId={taskId} />;
}
