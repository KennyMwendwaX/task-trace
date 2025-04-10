import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import RequestsContent from "./components/requests-content";
import { getMembershipRequests } from "@/server/api/project/members";

type Props = { params: Promise<{ projectId: string }> };

export default async function MembershipRequests({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  const { projectId } = await params;

  const requestsResult = await getMembershipRequests(
    projectId,
    session.user.id
  );

  if (requestsResult.error) {
    throw new Error(requestsResult.error.message);
  }

  const requests = requestsResult.data ?? [];

  return <RequestsContent requests={requests} />;
}
