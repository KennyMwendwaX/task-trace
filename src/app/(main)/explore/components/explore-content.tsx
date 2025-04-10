import { PublicProject } from "@/database/schema";
import ExploreFilters from "./explore-filters";
import ProjectCard from "./project-card";
import { LuFolders } from "react-icons/lu";
import { MdOutlineFolderOff } from "react-icons/md";

interface ExploreContentProps {
  projects: PublicProject[];
  initialSearch: string;
  initialFilter: string;
  initialSort: string;
}

export default function ExploreContent({
  projects,
  initialSearch,
  initialFilter,
  initialSort,
}: ExploreContentProps) {
  return (
    <main className="container mx-auto px-4 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
      <ExploreFilters
        initialSearch={initialSearch}
        initialFilter={initialFilter}
        initialSort={initialSort}
      />

      {projects.length > 0 ? (
        <>
          <div className="flex items-center mt-8">
            <LuFolders className="mr-2 w-7 h-7" />
            <span className="text-xl font-semibold">Explore Projects</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      ) : (
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center pt-36">
          <MdOutlineFolderOff className="h-14 w-14 text-muted-foreground" />
          <h3 className="mt-4 text-2xl font-semibold">No projects found</h3>
          <p className="mb-4 mt-2 text-lg text-muted-foreground">
            Try adjusting your search or filter criteria to find more projects.
          </p>
        </div>
      )}
    </main>
  );
}
