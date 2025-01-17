"use client";

import {
  useProjectQuery,
  useProjectTaskQuery,
} from "@/hooks/useProjectQueries";
import { useProjectStore } from "@/hooks/useProjectStore";
import Loading from "../loading";
import { useParams, usePathname } from "next/navigation";
import TaskNotFound from "./task-not-found";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function TaskLayoutWrapper({ children }: LayoutWrapperProps) {
  const params = useParams<{ projectId: string; taskId: string }>();
  const pathname = usePathname();
  const projectId = params.projectId;
  const taskId = params.taskId;

  const { isLoading: projectIsLoading } = useProjectQuery(projectId);
  const { isLoading: taskIsLoading } = useProjectTaskQuery(projectId, taskId);

  const { task } = useProjectStore();

  const isLoading = projectIsLoading || taskIsLoading;

  if (isLoading && pathname === `/projects/${projectId}/tasks/${taskId}`) {
    return <Loading />;
  }

  if (!task) {
    return <TaskNotFound projectId={projectId} />;
  }

  return <>{children}</>;
}
