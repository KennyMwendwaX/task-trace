import ExploreContent from "./components/explore-content";
import { getProjects } from "@/server/api/user/projects";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Update types to match new Promise-based approach
type SearchParams = Promise<{
  search?: string;
  filter?: string;
  sort?: string;
}>;

interface PageProps {
  searchParams: SearchParams;
}

export default async function ExplorePage(props: PageProps) {
  // Await the searchParams promise
  const searchParams = await props.searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const result = await getProjects(session.user.id);

  if (result.error) {
    throw new Error(result.error.message);
  }

  const projects = result.data ?? [];

  // Server-side filtering and sorting
  const search = searchParams?.search || "";
  const filter = searchParams?.filter || "ALL";
  const sort = searchParams?.sort || "date_desc";

  const filteredProjects = projects
    .filter((project) =>
      project.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((project) => filter === "ALL" || project.status === filter)
    .sort((a, b) => {
      switch (sort) {
        case "date_desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "date_asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  return (
    <ExploreContent
      projects={filteredProjects}
      initialSearch={search}
      initialFilter={filter}
      initialSort={sort}
    />
  );
}
