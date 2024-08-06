"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Project } from "@/lib/schema/ProjectSchema";
import ProjectCard from "./components/project-card";
import { Input } from "@/components/ui/input";
import { LuFolders, LuSearch } from "react-icons/lu";
import { MdOutlineFolderOff } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "./components/loading";

export default function Explore() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchPublicProjects = async (): Promise<Project[]> => {
    const { data } = await axios.get("/api/projects");
    return data.publicProjects
      .map((project: Project) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: project.updatedAt ? new Date(project.updatedAt) : null,
      }))
      .sort(
        (a: Project, b: Project) =>
          b.createdAt.getTime() - a.createdAt.getTime()
      );
  };

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["public-projects"],
    queryFn: () => fetchPublicProjects(),
  });

  const search = searchParams.get("search") || "";
  const filter = searchParams.get("filter") || "ALL";
  const sort = searchParams.get("sort") || "date";

  const updateUrlParams = (
    newSearch?: string,
    newFilter?: string,
    newSort?: string
  ) => {
    const params = new URLSearchParams(searchParams);
    if (newSearch !== undefined) params.set("search", newSearch);
    if (newFilter !== undefined) params.set("filter", newFilter);
    if (newSort !== undefined) params.set("sort", newSort);
    router.push(`/explore?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUrlParams(e.target.value, filter, sort);
  };

  const handleFilterChange = (value: string) => {
    updateUrlParams(search, value, sort);
  };

  const handleSortChange = (value: string) => {
    updateUrlParams(search, filter, value);
  };

  const filteredProjects = projects
    .filter((project) =>
      project.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((project) => filter === "ALL" || project.status === filter)
    .sort((a, b) => {
      if (sort === "date") {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  return (
    <main className="container mx-auto px-4 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {filteredProjects.length > 0 ? (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-auto sm:flex-grow">
                  <LuSearch className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="w-full pl-8 rounded-lg bg-background sm:w-[200px] md:w-[400px]"
                    value={search}
                    onChange={handleSearch}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filter} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Statuses</SelectItem>
                      <SelectItem value="BUILDING">Building</SelectItem>
                      <SelectItem value="LIVE">Live</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center mt-8">
                <LuFolders className="mr-2 w-7 h-7" />
                <span className="text-xl font-semibold">Explore Projects</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </>
          ) : (
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center pt-36">
              <MdOutlineFolderOff className="h-14 w-14 text-muted-foreground" />
              <h3 className="mt-4 text-2xl font-semibold">No projects found</h3>
              <p className="mb-4 mt-2 text-lg text-muted-foreground">
                Try adjusting your search or filter criteria to find more
                projects.
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
