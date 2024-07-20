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
import { useSession } from "next-auth/react";
import { projectsData } from "./components/projects";
import { ProjectRole, ProjectStatus } from "@/lib/config";
import { useSearchParams, useRouter } from "next/navigation";

interface UserProject extends Project {
  memberRole: ProjectRole;
}

export default function Projects() {
  const session = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";

  const userId = session.data?.user?.id;

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["projects", userId],
  //   queryFn: async () => {
  //     const { data } = await axios.get("/api/projects");
  //     return data.projects as Project[];
  //   },
  // });

  // const ownedProjects = data?.ownedProjects || [];
  // const memberProjects = data?.memberProjects || [];

  // if (isLoading) {
  //   return (
  //     <main className="container mx-auto px-8 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
  //       <Loading />
  //     </main>
  //   );
  // }

  const userProjects = [] as Project[];
  const memberProjects = projectsData.map((project) => ({
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
    router.push(`/projects?search=${encodeURIComponent(searchQuery)}`, {
      scroll: false,
    });
  };

  const filteredUserProjects = userProjects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMemberProjects = memberProjects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  const hasProjects = userProjects.length > 0 || memberProjects.length > 0;
  const hasFilteredProjects =
    filteredUserProjects.length > 0 || filteredMemberProjects.length > 0;

  return (
    <main className="container mx-auto px-4 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
      {hasProjects || search ? (
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
              {filteredUserProjects.length > 0 && (
                <>
                  <div className="flex items-center mt-5">
                    <LuPin className="mr-2 w-7 h-7" />
                    <span className="text-xl font-semibold">My Projects</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
                    {filteredUserProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </>
              )}

              {filteredMemberProjects.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center">
                    <LuFolders className="mr-2 w-7 h-7" />
                    <span className="text-xl font-semibold">
                      {filteredUserProjects.length > 0
                        ? "Member Projects"
                        : "Projects"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
                    {filteredMemberProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
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
    </main>
  );
}
