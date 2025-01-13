"use client";

import {
  useProjectMembersQuery,
  useProjectQuery,
} from "@/hooks/useProjectQueries";
import Loading from "../loading";
import { useParams, usePathname } from "next/navigation";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function MembersLayoutWrapper({ children }: LayoutWrapperProps) {
  const params = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const projectId = params.projectId;

  const { isLoading: projectIsLoading } = useProjectQuery(projectId);
  const { isLoading: membersIsLoading } = useProjectMembersQuery(projectId);

  const isLoading = projectIsLoading || membersIsLoading;

  if (isLoading && pathname === `/projects/${projectId}/members`) {
    return <Loading />;
  }

  return <>{children}</>;
}
