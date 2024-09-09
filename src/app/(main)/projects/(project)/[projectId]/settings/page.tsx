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
import InvitationCodeModal from "../components/invitation-code-modal";

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
    return <InvitationCodeModal projectId={projectId} />;
  }

  return (
    <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {project.name} Settings
        </h1>
        <UpdateProjectDetails project={project} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <ProjectVisibility project={project} />
          <DangerZone projectId={project.id} />
        </div>
        <ProjectInvite projectId={projectId} invitationCode={invitationCode} />
      </div>
    </main>
  );
}
