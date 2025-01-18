import { auth } from "@/auth";
import { redirect } from "next/navigation";
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

  return <MembersContent projectId={projectId} />;
}
