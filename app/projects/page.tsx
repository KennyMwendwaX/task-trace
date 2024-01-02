import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";

export default function Projects() {
  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:px-6 py-4">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl">Projects</h1>
          <Button className="ml-auto" size="sm">
            New Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </div>
      </main>
    </>
  );
}
