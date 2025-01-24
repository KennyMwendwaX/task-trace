import { auth } from "@/auth";
import { redirect } from "next/navigation";
import MembersContent from "./components/members-content";
import { getProject } from "@/server/actions/project/project";
import { getProjectMembers } from "@/server/actions/project/members";
import ProjectNotFound from "../components/project-not-found";

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

  if (projectResult.error || membersResult.error) {
    throw new Error("Failed to fetch project members data");
  }

  const project = projectResult.data;
  const members = membersResult.data ?? [];

  if (!project) {
    return <ProjectNotFound />;
  }

  return <MembersContent project={project} members={members} />;
}
