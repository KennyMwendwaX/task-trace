"use client";

import {
  useProjectQuery,
  useProjectRequestsQuery,
} from "@/hooks/useProjectQueries";
import Loading from "../loading";
import { useParams, usePathname } from "next/navigation";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function RequestsLayoutWrapper({
  children,
}: LayoutWrapperProps) {
  const params = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const projectId = params.projectId;

  const { isLoading: projectIsLoading } = useProjectQuery(projectId);
  const { isLoading: requestsIsLoading } = useProjectRequestsQuery(projectId);

  const isLoading = projectIsLoading || requestsIsLoading;

  if (isLoading && pathname === `/projects/${projectId}/members/requests`) {
    return <Loading />;
  }

  return <>{children}</>;
}
