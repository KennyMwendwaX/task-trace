"use client";

import ProjectNotFound from "../components/project-not-found";
import Loading from "./components/loading";
import UpdateProjectDetails from "./components/update-project-details";
import ProjectVisibility from "./components/project-visibilty";
import DangerZone from "./components/danger-zone";
import ProjectInvite from "./components/project-invite";
import { useProjectStore } from "@/hooks/useProjectStore";
import {
  useProjectInvitationCodeQuery,
  useProjectQuery,
} from "@/hooks/useProjectQueries";
import JoinProjectModal from "../components/join-project-modal";

export default function Settings({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;

  const { isLoading: projectIsLoading } = useProjectQuery(projectId);
  const { isLoading: invitationCodeIsLoading } =
    useProjectInvitationCodeQuery(projectId);

  const { project, invitationCode } = useProjectStore();

  if (projectIsLoading || invitationCodeIsLoading) {
    return <Loading />;
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  const isPrivateProject = !project.isPublic;
  const isNotMember = !project.member;

  if (isPrivateProject && isNotMember) {
    return <JoinProjectModal projectId={projectId} />;
  }

  return (
    <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words max-w-full sm:max-w-[70%]">
          {project.name} Settings
        </h1>
        <UpdateProjectDetails project={project} />
      </div>

      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="order-2 md:order-1 md:flex-grow space-y-6 mt-6 md:mt-0">
          <ProjectVisibility project={project} />
          <DangerZone projectId={project.id} />
        </div>
        <div className="order-1 md:order-2 md:w-1/3">
          <ProjectInvite
            projectId={projectId}
            invitationCode={invitationCode}
          />
        </div>
      </div>
    </main>
  );
}
