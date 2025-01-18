import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AnalyticsContent from "./components/analytics-content";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Analytics({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  const { projectId } = await params;

  return <AnalyticsContent projectId={projectId} />;
}
