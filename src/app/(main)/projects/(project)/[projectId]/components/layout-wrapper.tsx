"use client";

import {
  useProjectMembersQuery,
  useProjectQuery,
  useProjectTasksQuery,
} from "@/hooks/useProjectQueries";
import { useUsersQuery } from "@/hooks/useUserQueries";
import { useProjectStore } from "@/hooks/useProjectStore";
import Loading from "../components/loading";
import ProjectNotFound from "../components/project-not-found";
import JoinProjectModal from "../components/join-project-modal";
import { useParams, usePathname } from "next/navigation";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function ProjectLayoutWrapper({ children }: LayoutWrapperProps) {
  const params = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const projectId = params.projectId;

  const { isLoading: projectIsLoading } = useProjectQuery(projectId);
  const { isLoading: usersIsLoading } = useUsersQuery();
  const { isLoading: membersIsLoading } = useProjectMembersQuery(projectId);
  const { isLoading: tasksIsLoading } = useProjectTasksQuery(projectId);

  const { project } = useProjectStore();

  const isLoading =
    projectIsLoading || usersIsLoading || membersIsLoading || tasksIsLoading;

  if (isLoading && pathname === `/projects/${projectId}`) {
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

  return <>{children}</>;
}
