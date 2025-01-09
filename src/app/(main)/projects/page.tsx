import { redirect } from "next/navigation";
import ProjectsContent from "./components/projects-content";
import { auth } from "@/auth";

interface SearchParams {
  search?: string;
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <ProjectsContent userId={session.user.id} searchParams={searchParams} />
  );
}
