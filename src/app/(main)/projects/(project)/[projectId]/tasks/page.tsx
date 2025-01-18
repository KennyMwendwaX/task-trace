import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TasksContent from "./components/tasks-content";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Tasks({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  const { projectId } = await params;

  return <TasksContent projectId={projectId} />;
}
