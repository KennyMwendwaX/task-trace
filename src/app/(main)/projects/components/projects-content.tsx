"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddProjectModal from "@/app/(main)/components/add-project-modal";
import ProjectCard from "./project-card";
import { LuPin, LuShield, LuUsers, LuSearch, LuX } from "react-icons/lu";
import { MdOutlineFolderOff } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MemberProject } from "@/database/schema";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

interface ProjectsContentProps {
  projects: MemberProject[];
  ownedProjects: MemberProject[];
  adminProjects: MemberProject[];
  memberProjects: MemberProject[];
}

export default function ProjectsContent({
  projects,
  ownedProjects,
  adminProjects,
  memberProjects,
}: ProjectsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize state from URL params when component mounts
  useEffect(() => {
    const search = searchParams.get("search") || "";
    setSearchQuery(search);
  }, [searchParams]);

  const updateUrlParams = useCallback(
    (newSearch: string) => {
      const params = new URLSearchParams(searchParams);

      if (newSearch) {
        params.set("search", newSearch);
      } else {
        params.delete("search");
      }

      // Create the new URL based on the current pathname
      const queryString = params.toString();
      const currentPath = window.location.pathname;
      router.push(queryString ? `${currentPath}?${queryString}` : currentPath, {
        scroll: false,
      });
    },
    [router, searchParams]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    updateUrlParams("");
  }, [updateUrlParams]);

  const getFilteredProjects = (projectList: MemberProject[]) => {
    if (!searchQuery) return projectList;

    return projectList.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredOwnedProjects = getFilteredProjects(ownedProjects);
  const filteredAdminProjects = getFilteredProjects(adminProjects);
  const filteredMemberProjects = getFilteredProjects(memberProjects);

  const totalFilteredProjects =
    filteredOwnedProjects.length +
    filteredAdminProjects.length +
    filteredMemberProjects.length;

  const renderProjectSection = (
    projects: MemberProject[],
    title: string,
    icon: React.ReactNode
  ) => {
    const filteredSectionProjects = getFilteredProjects(projects);

    if (filteredSectionProjects.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-5 h-5 text-muted-foreground">
            {icon}
          </div>
          <span className="text-lg font-semibold ml-2">{title}</span>
          <Badge variant="outline" className="ml-2 px-2 py-0 h-6 text-xs">
            {filteredSectionProjects.length}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
          {filteredSectionProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col space-y-6">
        {projects.length > 0 ? (
          <>
            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 w-full">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-9 h-9 bg-background text-sm w-full pr-10"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    updateUrlParams(e.target.value);
                  }}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={handleClearSearch}>
                    <LuX className="h-4 w-4" />
                  </button>
                )}
              </div>
              <AddProjectModal />
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <span>
                {searchQuery
                  ? `${totalFilteredProjects} of ${projects.length} projects found`
                  : `${projects.length} total projects`}
              </span>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-7 px-2 text-xs"
                  onClick={handleClearSearch}>
                  Clear search
                </Button>
              )}
            </div>

            {searchQuery && totalFilteredProjects === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center py-16">
                  <LuSearch className="h-12 w-12 text-muted-foreground/60" />
                  <h3 className="mt-4 text-xl font-semibold">
                    No matches found
                  </h3>
                  <p className="mb-4 mt-2 text-muted-foreground">
                    No projects match your search query. Try using different
                    keywords or clear your search.
                  </p>
                  <Button variant="outline" onClick={handleClearSearch}>
                    Clear search
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
                {renderProjectSection(
                  ownedProjects,
                  "Owned Projects",
                  <LuPin className="w-6 h-6 text-primary/80" />
                )}
                {renderProjectSection(
                  adminProjects,
                  "Admin Projects",
                  <LuShield className="w-6 h-6 text-amber-500/80" />
                )}
                {renderProjectSection(
                  memberProjects,
                  "Member Projects",
                  <LuUsers className="w-6 h-6 text-emerald-500/80" />
                )}
              </>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center pt-36">
            <MdOutlineFolderOff className="h-16 w-16 text-muted-foreground/60" />
            <h3 className="mt-4 text-2xl font-semibold">No projects found</h3>
            <p className="mb-6 mt-2 text-muted-foreground">
              You do not have any projects. Add one below or join a project.
            </p>
            <AddProjectModal />
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
