import { redirect } from "next/navigation";
import ProjectsContent from "./components/projects-content";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserProjects } from "@/server/api/user/projects";
import { tryCatch } from "@/lib/try-catch";

export default async function ProjectsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { data: projects, error } = await tryCatch(
    getUserProjects(session.user.id)
  );

  if (error) {
    throw new Error(error.message);
  }

  // Organize projects by role
  const ownedProjects = projects.filter(
    (project) => project.memberRole === "OWNER"
  );
  const adminProjects = projects.filter(
    (project) => project.memberRole === "ADMIN"
  );
  const memberProjects = projects.filter(
    (project) => project.memberRole === "MEMBER"
  );

  return (
    <ProjectsContent
      projects={projects}
      ownedProjects={ownedProjects}
      adminProjects={adminProjects}
      memberProjects={memberProjects}
    />
  );
}
