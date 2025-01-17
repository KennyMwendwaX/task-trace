import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getProject } from "./actions";
import StoreInitializer from "./components/store-initializer";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const { projectId } = params;
  const projectResult = await getProject(projectId, session.user.id);
  const project = projectResult.data;

  if (!project) {
    redirect("/projects");
  }

  return <StoreInitializer project={project}>{children}</StoreInitializer>;
}
