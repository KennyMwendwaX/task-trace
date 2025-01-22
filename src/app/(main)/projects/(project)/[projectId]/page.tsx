import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProjectContent from "./components/project-content";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectPage({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const { projectId } = await params;

  return <ProjectContent projectId={projectId} />;
}
