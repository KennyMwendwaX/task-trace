"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PublicProject } from "@/server/database/schema";
import ExploreFilters from "./explore-filters";
import ProjectCard from "./project-card";
import { LuFolders, LuSearch } from "react-icons/lu";
import { MdOutlineFolderOff } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

interface ExploreContentProps {
  projects: PublicProject[];
  bookmarkedProjects: PublicProject[];
}

export default function ExploreContent({
  projects,
  bookmarkedProjects,
}: ExploreContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters
  const search = searchParams.get("search") || "";
  const filter = searchParams.get("filter") || "ALL";
  const sort = searchParams.get("sort") || "date_desc";
  const bookmarkFilter = searchParams.get("bookmarks") || "ALL";

  const handleClearFilters = useCallback(() => {
    // Push to URL without any parameters
    router.push("/explore", { scroll: false });
  }, [router]);

  // Apply filtering and sorting to projects
  const filteredProjects = projects.filter((project) => {
    // Apply search filter
    if (search && !project.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // Apply status filter
    if (filter !== "ALL") {
      if (filter === "LIVE" && project.status !== "LIVE") return false;
      if (filter === "BUILDING" && project.status !== "BUILDING") return false;
    }

    // Apply bookmark filter
    if (bookmarkFilter !== "ALL") {
      const bookmarkedIds = bookmarkedProjects.map((bp) => bp.id);
      const isBookmarked = bookmarkedIds.includes(project.id);
      if (bookmarkFilter === "BOOKMARKED" && !isBookmarked) return false;
      if (bookmarkFilter === "NOT_BOOKMARKED" && isBookmarked) return false;
    }

    return true;
  });

  // Apply sorting
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sort) {
      case "date_desc":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "date_asc":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const filtersActive =
    search ||
    filter !== "ALL" ||
    sort !== "date_desc" ||
    bookmarkFilter !== "ALL";
  const activeFilterCount = [
    search ? 1 : 0,
    filter !== "ALL" ? 1 : 0,
    bookmarkFilter !== "ALL" ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <main className="container mx-auto px-4 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}>
        <ExploreFilters
          initialSearch={search}
          initialFilter={filter}
          initialSort={sort}
          initialBookmarkFilter={bookmarkFilter}
        />

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <LuFolders className="w-6 h-6 text-primary/80" />
            <span className="text-xl font-semibold">Explore Projects</span>
            <Badge variant="outline" className="ml-1 px-2 py-0 h-6 text-xs">
              {sortedProjects.length} of {projects.length}
            </Badge>
            {filtersActive && activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-2 py-0 h-6 text-xs">
                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}{" "}
                active
              </Badge>
            )}
          </div>

          {filtersActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-sm hover:bg-destructive/10 hover:text-destructive">
              Clear all filters
            </Button>
          )}
        </div>

        {sortedProjects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
            {sortedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center py-16">
            {filtersActive ? (
              <>
                <LuSearch className="h-12 w-12 text-muted-foreground/60" />
                <h3 className="mt-4 text-xl font-semibold">No matches found</h3>
                <p className="mb-4 mt-2 text-muted-foreground">
                  No projects match your current filters. Try adjusting your
                  search or filter criteria.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear all filters
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      router.push("/explore?filter=ALL&bookmarks=ALL")
                    }
                    className="text-muted-foreground">
                    Reset to default
                  </Button>
                </div>
              </>
            ) : (
              <>
                <MdOutlineFolderOff className="h-16 w-16 text-muted-foreground/60" />
                <h3 className="mt-4 text-2xl font-semibold">
                  No projects available
                </h3>
                <p className="mb-4 mt-2 text-muted-foreground">
                  There are currently no projects to explore.
                </p>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
