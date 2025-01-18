import { auth } from "@/auth";
import EditTaskForm from "./components/edit-task-form";
import { redirect } from "next/navigation";

type Props = { params: Promise<{ projectId: string; taskId: string }> };

export default async function EditTaskPage({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const { projectId, taskId } = await params;

  return <EditTaskForm projectId={projectId} taskId={taskId} />;
}
