import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RequestsContent from "./components/requests-content";
import { getMembershipRequests } from "@/server/api/project/members";
import { tryCatch } from "@/lib/try-catch";
import { getProject } from "@/server/api/project/project";

type Props = { params: Promise<{ projectId: string }> };

export default async function MembershipRequests({ params }: Props) {
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

  const { data: requests, error: requestsError } = await tryCatch(
    getMembershipRequests(projectId, session.user.id)
  );

  if (projectError) {
    throw new Error("Failed to fetch project");
  }

  if (requestsError) {
    throw new Error("Failed to fetch project membership requests");
  }

  return <RequestsContent project={project} requests={requests} />;
}
