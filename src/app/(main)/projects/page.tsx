import { redirect } from "next/navigation";
import ProjectsContent from "./components/projects-content";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type SearchParams = Promise<{
  search?: string;
}>;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <ProjectsContent userId={session.user.id} searchParams={searchParams} />
  );
}
