import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CreateTaskForm from "./components/create-task-form";
import { redirect } from "next/navigation";
import { getProjectMembers } from "@/server/api/project/members";

type Props = { params: Promise<{ projectId: string }> };

export default async function CreateTaskPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  const { projectId } = await params;

  const membersResult = await getProjectMembers(projectId, session.user.id);

  if (membersResult.error) {
    throw new Error(membersResult.error.message);
  }

  const members = membersResult.data ?? [];

  return <CreateTaskForm projectId={projectId} members={members} />;
}
