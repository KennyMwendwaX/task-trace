"use client";

import {
  useProjectInvitationCodeQuery,
  useProjectQuery,
} from "@/hooks/useProjectQueries";
import Loading from "./loading";

import { useParams, usePathname } from "next/navigation";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function SettingsLayoutWrapper({
  children,
}: LayoutWrapperProps) {
  const params = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const projectId = params.projectId;

  const { isLoading: projectIsLoading } = useProjectQuery(projectId);
  const { isLoading: invitationCodeIsLoading } =
    useProjectInvitationCodeQuery(projectId);

  const isLoading = projectIsLoading || invitationCodeIsLoading;

  if (isLoading && pathname === `/projects/${projectId}/settings`) {
    return <Loading />;
  }

  return <>{children}</>;
}
