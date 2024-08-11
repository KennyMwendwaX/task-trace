"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "@/lib/api/projects";
import NoProjectFound from "../components/no-project-found";
import UpdateProjectDetails from "./components/update-project-details";
import ProjectVisibility from "./components/project-visibilty";
import DangerZone from "./components/danger-zone";
import ProjectInvite from "./components/project-invite";

export default function Settings({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;

  const {
    data: project,
    isLoading: projectIsLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });

  // if (projectIsLoading) {
  //   return <Loading />;
  // }

  if (!project) {
    return <NoProjectFound />;
  }

  return (
    <>
      <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
        <div className="text-2xl font-bold tracking-tight">
          Go concurrency model Settings
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-4 items-start mt-2">
          <div className="w-full flex flex-col gap-4">
            <UpdateProjectDetails project={project} />
            <ProjectVisibility project={project} />
            <DangerZone />
          </div>
          <ProjectInvite />
        </div>
      </main>
    </>
  );
}
