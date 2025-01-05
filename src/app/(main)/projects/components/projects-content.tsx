import { getUserProjects } from "../actions";
import AddProjectModal from "@/components/add-project-modal";
import ProjectCard from "./project-card";
import { LuPin, LuShield, LuUsers } from "react-icons/lu";
import { MdOutlineFolderOff } from "react-icons/md";
import { MemberProject } from "@/lib/schema/ProjectSchema";
import ProjectsSearch from "./projects-search";
import SearchResults from "./search-results";

interface ProjectsContentProps {
  userId?: string;
  searchParams?: Promise<{
    search?: string;
  }>;
}

export default async function ProjectsContent({
  userId,
  searchParams,
}: ProjectsContentProps) {
  const result = await getUserProjects(userId);

  if (result.error) {
    throw new Error(result.error);
  }

  const projects = result.data ?? [];

  const params = searchParams ? await searchParams : {};
  const searchQuery = params.search ?? null;

  const ownedProjects = projects.filter(
    (project) => project.memberRole === "OWNER"
  );
  const adminProjects = projects.filter(
    (project) => project.memberRole === "ADMIN"
  );
  const memberProjects = projects.filter(
    (project) => project.memberRole === "MEMBER"
  );

  const renderProjectSection = (
    projects: MemberProject[],
    title: string,
    icon: React.ReactNode,
    searchParam: string | null
  ) => {
    const filteredSectionProjects = searchParam
      ? projects.filter((project) =>
          project.name.toLowerCase().includes(searchParam.toLowerCase())
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
      {projects.length > 0 ? (
        <>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-2">
            <ProjectsSearch initialSearch={searchQuery ?? ""} />
            <AddProjectModal />
          </div>
          {searchQuery ? (
            <SearchResults projects={projects} searchQuery={searchQuery} />
          ) : (
            <>
              {renderProjectSection(
                ownedProjects,
                "Owned Projects",
                <LuPin className="w-7 h-7" />,
                searchQuery
              )}
              {renderProjectSection(
                adminProjects,
                "Admin Projects",
                <LuShield className="w-7 h-7" />,
                searchQuery
              )}
              {renderProjectSection(
                memberProjects,
                "Member Projects",
                <LuUsers className="w-7 h-7" />,
                searchQuery
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
          <AddProjectModal />
        </div>
      )}
    </main>
  );
}
