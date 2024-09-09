"use client";

import AddProjectModal from "@/components/AddProjectModal";
import Loading from "./components/loading";
import ProjectCard from "./components/project-card";
import { Input } from "@/components/ui/input";
import { LuFolders, LuPin, LuSearch, LuShield, LuUsers } from "react-icons/lu";
import JoinProjectModal from "@/components/join-project-modal";
import { MdOutlineFolderOff } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useUsersProjectsQuery } from "@/hooks/useUserQueries";
import { useUserStore } from "@/hooks/useUserStore";
import { UserProject } from "@/lib/schema/ProjectSchema";

export default function Projects() {
  const session = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const userId = session.data?.user?.id;

  const { isLoading } = useUsersProjectsQuery(userId);
  const { projects } = useUserStore();

  const ownedProjects = projects.filter(
    (project) => project.memberRole === "OWNER"
  );
  const adminProjects = projects.filter(
    (project) => project.memberRole === "ADMIN"
  );
  const memberProjects = projects.filter(
    (project) => project.memberRole === "MEMBER"
  );

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setSearch(searchQuery);
    router.push(`/projects?search=${encodeURIComponent(searchQuery)}`, {
      scroll: false,
    });
  };

  const renderProjectSection = (
    projects: UserProject[],
    title: string,
    icon: React.ReactNode
  ) => {
    const filteredSectionProjects = search
      ? projects.filter((project) =>
          project.name.toLowerCase().includes(search.toLowerCase())
        )
      : projects;

    if (filteredSectionProjects.length === 0) return null;

    return (
      <div className="mt-6">
        <div className="flex items-center">
          {icon}
          <span className="text-xl font-semibold ml-2">{title}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
          {filteredSectionProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {projects.length > 0 ? (
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
                <div className="flex items-center gap-2">
                  <JoinProjectModal />
                  <AddProjectModal />
                </div>
              </div>
              {search ? (
                filteredProjects.length > 0 ? (
                  <div className="mt-6">
                    <div className="flex items-center">
                      <LuFolders className="mr-2 w-7 h-7" />
                      <span className="text-xl font-semibold">
                        Search Results
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
                      {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center mt-8">
                    <p>No projects found matching &quot;{search}&quot;</p>
                  </div>
                )
              ) : (
                <>
                  {renderProjectSection(
                    ownedProjects,
                    "Owned Projects",
                    <LuPin className="w-7 h-7" />
                  )}
                  {renderProjectSection(
                    adminProjects,
                    "Admin Projects",
                    <LuShield className="w-7 h-7" />
                  )}
                  {renderProjectSection(
                    memberProjects,
                    "Member Projects",
                    <LuUsers className="w-7 h-7" />
                  )}
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
        </>
      )}
    </main>
  );
}
