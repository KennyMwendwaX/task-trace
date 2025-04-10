import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AnalyticsContent from "./components/analytics-content";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Analytics({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { projectId } = await params;

  return <AnalyticsContent projectId={projectId} />;
}
