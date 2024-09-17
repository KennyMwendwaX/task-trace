"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ProjectCard from "./components/project-card";
import { Input } from "@/components/ui/input";
import {
  LuArrowUpDown,
  LuCalendarDays,
  LuChevronDown,
  LuClock,
  LuFilter,
  LuFolders,
  LuSearch,
  LuSlidersHorizontal,
} from "react-icons/lu";
import { MdOutlineFolderOff } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Loading from "./components/loading";
import { useProjectsQuery } from "@/hooks/useProjectQueries";
import { useProjectStore } from "@/hooks/useProjectStore";

export default function Explore() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { isLoading } = useProjectsQuery();
  const { projects } = useProjectStore();

  const search = searchParams.get("search") || "";
  const filter = searchParams.get("filter") || "ALL";
  const sort = searchParams.get("sort") || "date_desc";

  const updateUrlParams = (
    newSearch?: string,
    newFilter?: string,
    newSort?: string
  ) => {
    const params = new URLSearchParams(searchParams);
    if (newSearch !== undefined) params.set("search", newSearch);
    if (newFilter !== undefined) params.set("filter", newFilter);
    if (newSort !== undefined) params.set("sort", newSort);
    router.push(`/explore?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUrlParams(e.target.value, filter, sort);
  };

  const handleFilterChange = (value: string) => {
    updateUrlParams(search, value, sort);
  };

  const handleSortChange = (value: string) => {
    updateUrlParams(search, filter, value);
  };

  const getSortDisplayText = (sortValue: string) => {
    switch (sortValue) {
      case "date_desc":
        return "Date (Newest)";
      case "date_asc":
        return "Date (Oldest)";
      case "name_asc":
        return "Name (A-Z)";
      case "name_desc":
        return "Name (Z-A)";
      default:
        return "Sort by";
    }
  };

  const getFilterDisplayText = (filterValue: string) => {
    switch (filterValue) {
      case "ALL":
        return "All Statuses";
      case "BUILDING":
        return "Building";
      case "LIVE":
        return "Live";
      default:
        return "Filter by status";
    }
  };

  const filteredProjects = projects
    .filter((project) =>
      project.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((project) => filter === "ALL" || project.status === filter)
    .sort((a, b) => {
      switch (sort) {
        case "date_desc":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "date_asc":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  const getFilterIcon = (filterValue: string) => {
    switch (filterValue) {
      case "BUILDING":
        return <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />;
      case "LIVE":
        return <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />;
      default:
        return <LuSlidersHorizontal className="mr-2 h-4 w-4" />;
    }
  };

  const getSortIcon = (sortValue: string) => {
    switch (sortValue) {
      case "date_desc":
      case "date_asc":
        return <LuCalendarDays className="mr-2 h-4 w-4" />;
      case "name_asc":
      case "name_desc":
        return <LuArrowUpDown className="mr-2 h-4 w-4" />;
      default:
        return <LuClock className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <main className="container mx-auto px-4 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            <div className="flex gap-2">
              <DropdownMenu>
                <div className="flex">
                  <Button
                    variant="outline"
                    className="rounded-r-none border-r-0 pr-2 font-normal">
                    {getFilterIcon(filter)}
                    {getFilterDisplayText(filter)}
                  </Button>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-l-none px-2">
                      <LuChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onSelect={() => handleFilterChange("ALL")}>
                      <LuSlidersHorizontal className="mr-2 h-4 w-4" />
                      All Statuses
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleFilterChange("BUILDING")}>
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                      Building
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleFilterChange("LIVE")}>
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      Live
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <div className="flex">
                  <Button
                    variant="outline"
                    className="rounded-r-none border-r-0 pr-2 font-normal">
                    {getSortIcon(sort)}
                    {getSortDisplayText(sort)}
                  </Button>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-l-none px-2">
                      <LuChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onSelect={() => handleSortChange("date_desc")}>
                      <LuCalendarDays className="mr-2 h-4 w-4" />
                      Date (Newest)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleSortChange("date_asc")}>
                      <LuCalendarDays className="mr-2 h-4 w-4" />
                      Date (Oldest)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleSortChange("name_asc")}>
                      <LuArrowUpDown className="mr-2 h-4 w-4" />
                      Name (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleSortChange("name_desc")}>
                      <LuArrowUpDown className="mr-2 h-4 w-4" />
                      Name (Z-A)
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {filteredProjects.length > 0 ? (
            <>
              <div className="flex items-center mt-8">
                <LuFolders className="mr-2 w-7 h-7" />
                <span className="text-xl font-semibold">Explore Projects</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </>
          ) : (
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center pt-36">
              <MdOutlineFolderOff className="h-14 w-14 text-muted-foreground" />
              <h3 className="mt-4 text-2xl font-semibold">No projects found</h3>
              <p className="mb-4 mt-2 text-lg text-muted-foreground">
                Try adjusting your search or filter criteria to find more
                projects.
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
