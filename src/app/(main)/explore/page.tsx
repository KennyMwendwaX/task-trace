import ExploreContent from "./components/explore-content";
import { auth } from "@/auth";
import { getProjects } from "@/server/actions/user/projects";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams?: {
    search?: string;
    filter?: string;
    sort?: string;
  };
}

export default async function ExplorePage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const result = await getProjects(session.user.id);

  if (result.error) {
    throw new Error(result.error.message);
  }

  const projects = result.data ?? [];

  // Server-side filtering and sorting
  const params = searchParams ? await searchParams : {};
  const search = params?.search || "";
  const filter = params?.filter || "ALL";
  const sort = params?.sort || "date_desc";

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
