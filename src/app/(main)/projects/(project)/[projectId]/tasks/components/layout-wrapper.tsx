"use client";

import {
  useProjectQuery,
  useProjectTasksQuery,
} from "@/hooks/useProjectQueries";
import Loading from "./loading";
import { useParams, usePathname } from "next/navigation";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function TasksLayoutWrapper({ children }: LayoutWrapperProps) {
  const params = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const projectId = params.projectId;

  const { isLoading: projectIsLoading } = useProjectQuery(projectId);
  const { isLoading: tasksIsLoading } = useProjectTasksQuery(projectId);

  const isLoading = projectIsLoading || tasksIsLoading;

  if (isLoading && pathname === `/projects/${projectId}/tasks`) {
    return <Loading />;
  }

  return <>{children}</>;
}
