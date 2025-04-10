import { redirect } from "next/navigation";
import ProjectsContent from "./components/projects-content";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserProjects } from "@/server/api/user/projects";
import { tryCatch } from "@/lib/try-catch";

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

  const params = searchParams ? await searchParams : {};

  const { data: projects, error } = await tryCatch(
    getUserProjects(session.user.id)
  );

  if (error) {
    throw new Error(error.message);
  }

  const sortedProjects = projects.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Organize projects by role
  const ownedProjects = sortedProjects.filter(
    (project) => project.memberRole === "OWNER"
  );
  const adminProjects = sortedProjects.filter(
    (project) => project.memberRole === "ADMIN"
  );
  const memberProjects = sortedProjects.filter(
    (project) => project.memberRole === "MEMBER"
  );

  return (
    <ProjectsContent
      userId={session.user.id}
      params={params}
      projects={sortedProjects}
      ownedProjects={ownedProjects}
      adminProjects={adminProjects}
      memberProjects={memberProjects}
    />
  );
}
