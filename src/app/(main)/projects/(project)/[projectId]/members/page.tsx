import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MembersContent from "./components/members-content";
import { getProject } from "@/server/api/project/project";
import { getProjectMembers } from "@/server/api/project/members";
import ProjectNotFound from "../components/project-not-found";
import { tryCatch } from "@/lib/try-catch";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};
export default async function Members({ params }: Props) {
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

  const { data: members, error: membersError } = await tryCatch(
    getProjectMembers(projectId, session.user.id)
  );

  if (projectError) {
    throw new Error("Failed to fetch project");
  }

  if (membersError) {
    throw new Error("Failed to fetch members");
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  return <MembersContent project={project} members={members} />;
}
