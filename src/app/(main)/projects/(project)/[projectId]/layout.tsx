import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getProject } from "./actions";
import StoreInitializer from "./components/store-initializer";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    projectId: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const { projectId } = await params;
  const projectResult = await getProject(projectId, session.user.id);
  if (projectResult.error) {
    throw new Error(projectResult.error);
  }

  const project = projectResult.data;

  if (!project) {
    notFound();
  }

  return <StoreInitializer project={project}>{children}</StoreInitializer>;
}
