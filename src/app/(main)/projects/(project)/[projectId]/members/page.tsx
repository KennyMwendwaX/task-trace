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

  const membersResult = await getProjectMembers(projectId, session.user.id);

  if (membersResult.error) {
    throw new Error(membersResult.error);
  }

  const members = membersResult.data ?? [];

  return <MembersContent projectId={projectId} members={members} />;
}
