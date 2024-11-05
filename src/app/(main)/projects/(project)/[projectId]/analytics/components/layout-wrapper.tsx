"use client";

import {
  useProjectMembersQuery,
  useProjectQuery,
  useProjectTasksQuery,
} from "@/hooks/useProjectQueries";
import { useUsersQuery } from "@/hooks/useUserQueries";
import Loading from "./loading";
import { useParams, usePathname } from "next/navigation";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function AnalyticsLayoutWrapper({
  children,
}: LayoutWrapperProps) {
  const params = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const projectId = params.projectId;

  const { isLoading: projectIsLoading } = useProjectQuery(projectId);
  const { isLoading: usersIsLoading } = useUsersQuery();
  const { isLoading: membersIsLoading } = useProjectMembersQuery(projectId);
  const { isLoading: tasksIsLoading } = useProjectTasksQuery(projectId);

  const isLoading =
    projectIsLoading || usersIsLoading || membersIsLoading || tasksIsLoading;

  if (isLoading && pathname === `/projects/${projectId}/analytics`) {
    return <Loading />;
  }

  return <div>{children}</div>;
}
