import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getProject, getProjectMembers } from "../actions";
import MembersContent from "./components/members-content";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};
export default async function Members({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  const { projectId } = await params;

  const projectResult = await getProject(projectId, session.user.id);
  const membersResult = await getProjectMembers(projectId, session.user.id);

  if (projectResult.error) {
    throw new Error(projectResult.error);
  }

  if (membersResult.error) {
    throw new Error(membersResult.error);
  }

  const project = projectResult.data;
  const members = membersResult.data ?? [];

  if (!project) {
    notFound();
  }

  return <MembersContent projectId={projectId} members={members} />;
}
