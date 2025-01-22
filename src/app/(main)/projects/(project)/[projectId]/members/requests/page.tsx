import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RequestsContent from "./components/requests-content";
import { getMembershipRequests } from "@/server/actions/project/members";

type Props = { params: Promise<{ projectId: string }> };

export default async function MembershipRequests({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
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
