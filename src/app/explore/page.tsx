"use client";

import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { projectsData } from "./components/projects";
import { ProjectRole, ProjectStatus } from "@/lib/config";
import { Project } from "@/lib/schema/ProjectSchema";
import ProjectCard from "./components/project-card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LuFolders, LuSearch } from "react-icons/lu";
import JoinProjectModal from "@/components/join-project-modal";
import { MdOutlineFolderOff } from "react-icons/md";
import AddProjectModal from "@/components/AddProjectModal";

export default function Explore() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";

  const projects = projectsData.map((project) => ({
    ...project,
    status: project.status as ProjectStatus,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
    invitationCode: {
      ...project.invitationCode,
      expiresAt: new Date(project.invitationCode.expiresAt),
    },
  }));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    router.push(`/explore?search=${encodeURIComponent(searchQuery)}`, {
      scroll: false,
    });
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  const hasFilteredProjects = filteredProjects.length > 0;

  return (
    <>
      {projects || search ? (
        <>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-2">
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
            <AddProjectModal />
          </div>

          {hasFilteredProjects ? (
            <>
              {filteredProjects.length > 0 && (
                <>
                  <div className="flex items-center mt-5">
                    <LuFolders className="mr-2 w-7 h-7" />
                    <span className="text-xl font-semibold">
                      Explore Projects
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center mt-8">
              <p>No projects found matching &quot;{search}&quot;</p>
            </div>
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
    </>
  );
}
