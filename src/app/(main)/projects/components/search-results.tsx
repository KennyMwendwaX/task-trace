import { MemberProject } from "@/lib/schema/ProjectSchema";
import { LuFolders } from "react-icons/lu";
import ProjectCard from "./project-card";

interface SearchResultsProps {
  projects: MemberProject[];
  searchQuery: string | null;
}

export default function SearchResults({
  projects,
  searchQuery,
}: SearchResultsProps) {
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes((searchQuery ?? "").toLowerCase())
  );

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center mt-8">
        <p>No projects found matching &quot;{searchQuery}&quot;</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex items-center">
        <LuFolders className="mr-2 w-7 h-7" />
        <span className="text-xl font-semibold">Search Results</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
