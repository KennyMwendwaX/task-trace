import AddProjectModal from "@/components/AddProjectModal";
import ProjectCard from "@/components/ProjectCard";

export default function Projects() {
  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:px-6 md:pt-20 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-lg md:text-2xl">Projects</h1>
          <AddProjectModal />
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
