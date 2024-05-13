"use client";

import AddProjectModal from "@/components/AddProjectModal";
import Loading from "@/components/Loading";
import ProjectCard from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Project } from "@/lib/schema/ProjectSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LuFolders, LuPin, LuSearch, LuFolderPlus } from "react-icons/lu";

export default function Projects() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axios.get("/api/projects");
      return data.projects as {
        pinnedProjects: Project[];
        otherProjects: Project[];
      };
    },
  });

  const pinnedProjects = data?.pinnedProjects || [];
  const otherProjects = data?.otherProjects || [];

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <>
      {pinnedProjects.length > 0 || otherProjects.length > 0 ? (
        <>
          <div className="flex items-center justify-between sm:gap-2">
            <div className="relative md:grow-0">
              <LuSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="w-[200px] rounded-lg bg-background pl-8 md:w-[345px] lg:w-[400px]"
              />
            </div>
            <AddProjectModal />
          </div>
          {pinnedProjects.length > 0 ? (
            <>
              <div className="flex items-center mt-5">
                <LuPin className="mr-2 w-7 h-7" />
                <span className="text-xl font-semibold">Pinned Projects</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
                {pinnedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              {otherProjects.length > 0 ? (
                <div className="mt-6">
                  <div className="flex items-center">
                    <LuFolders className="mr-2 w-7 h-7" />
                    <span className="text-xl font-semibold">
                      Other Projects
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
                    {otherProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between sm:gap-2">
                <div className="relative md:grow-0">
                  <LuSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="w-[200px] rounded-lg bg-background pl-8 md:w-[345px] lg:w-[400px]"
                  />
                </div>
                <AddProjectModal />
              </div>
              {otherProjects.length > 0 ? (
                <>
                  <div className="flex items-center mt-5">
                    <LuPin className="mr-2 w-7 h-7" />
                    <span className="text-xl font-semibold">Projects</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
                    {otherProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </>
              ) : null}
            </>
          )}
        </>
      ) : (
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center pt-36">
          <LuFolderPlus className="h-14 w-14 text-muted-foreground" />

          <h3 className="mt-4 text-2xl font-semibold">No projects found</h3>
          <p className="mb-4 mt-2 text-lg text-muted-foreground">
            You do not have any project. Add one below.
          </p>
          <AddProjectModal />
        </div>
      )}
    </>
  );
}
