import ExploreContent from "./components/explore-content";
import { getProjects } from "@/server/actions/project/project";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { tryCatch } from "@/lib/try-catch";
import { getUserBookmarkedProjects } from "@/server/actions/project/bookmark";

export default async function ExplorePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { data: projects, error: projectsError } = await tryCatch(
    getProjects(session.user.id)
  );
  if (projectsError) {
    throw new Error(projectsError.message);
  }

  const { data: bookmarkedProjects, error: bookmarkedProjectsError } =
    await tryCatch(getUserBookmarkedProjects(session.user.id));
  if (bookmarkedProjectsError) {
    throw new Error(bookmarkedProjectsError.message);
  }

  return (
    <ExploreContent
      projects={projects}
      bookmarkedProjects={bookmarkedProjects}
    />
  );
}
