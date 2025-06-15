import ExploreContent from "./components/explore-content";
import { getProjects } from "@/server/actions/project/project";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { tryCatch } from "@/lib/try-catch";

export default async function ExplorePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { data: projects, error } = await tryCatch(
    getProjects(session.user.id)
  );

  if (error) {
    throw new Error(error.message);
  }

  return <ExploreContent projects={projects} />;
}
