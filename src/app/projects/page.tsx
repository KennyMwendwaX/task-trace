"use client";

import AddProjectModal from "@/components/AddProjectModal";
import Loading from "./components/loading";
import ProjectCard from "./components/project-card";
import { Input } from "@/components/ui/input";
import { Project } from "@/lib/schema/ProjectSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LuFolders, LuPin, LuSearch } from "react-icons/lu";
import JoinProjectModal from "@/components/join-project-modal";
import { MdOutlineFolderOff } from "react-icons/md";

export default function Projects() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axios.get("/api/projects");
      return data as {
        userProjects: Project[];
        memberProjects: Project[];
      };
    },
  });

  const userProjects = data?.userProjects || [];
  const memberProjects = data?.userProjects || [];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="container mx-auto px-8 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
      {userProjects.length > 0 || memberProjects.length > 0 ? (
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
          {userProjects.length > 0 ? (
            <>
              <div className="flex items-center mt-5">
                <LuPin className="mr-2 w-7 h-7" />
                <span className="text-xl font-semibold">My Projects</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
                {userProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              {memberProjects.length > 0 ? (
                <div className="mt-6">
                  <div className="flex items-center">
                    <LuFolders className="mr-2 w-7 h-7" />
                    <span className="text-xl font-semibold">
                      Member Projects
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
                    {memberProjects.map((project) => (
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
              {memberProjects.length > 0 ? (
                <>
                  <div className="flex items-center mt-5">
                    <LuFolders className="mr-2 w-7 h-7" />
                    <span className="text-xl font-semibold">Projects</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
                    {memberProjects.map((project) => (
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
          <MdOutlineFolderOff className="h-14 w-14 text-muted-foreground" />

          <h3 className="mt-4 text-2xl font-semibold">No projects found</h3>
          <p className="mb-4 mt-2 text-lg text-muted-foreground">
            You do not have any project. Add one below or join a project.
          </p>
          <div className="flex items-center gap-2">
            <JoinProjectModal />
            <AddProjectModal />
          </div>
        </div>
      )}
    </main>
  );
}
