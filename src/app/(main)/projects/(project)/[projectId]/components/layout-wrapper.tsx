// "use client";

// import {
//   useProjectMembersQuery,
//   useProjectQuery,
//   useProjectTasksQuery,
// } from "@/hooks/useProjectQueries";
// import { useProjectStore } from "@/hooks/useProjectStore";
// import Loading from "../components/loading";
// import ProjectNotFound from "../components/project-not-found";
// import JoinProjectModal from "../components/join-project-modal";
// import { useParams, usePathname } from "next/navigation";

// interface LayoutWrapperProps {
//   children: React.ReactNode;
// }

// export default function ProjectLayoutWrapper({ children }: LayoutWrapperProps) {
//   const params = useParams<{ projectId: string }>();
//   const pathname = usePathname();
//   const projectId = params.projectId;

//   const { isLoading: projectIsLoading } = useProjectQuery(projectId);
//   const { isLoading: membersIsLoading } = useProjectMembersQuery(projectId);
//   const { isLoading: tasksIsLoading } = useProjectTasksQuery(projectId);

//   const { project } = useProjectStore();

//   const isLoading = projectIsLoading || membersIsLoading || tasksIsLoading;

//   if (isLoading && pathname === `/projects/${projectId}`) {
//     return <Loading />;
//   }

//   if (!project) {
//     return <ProjectNotFound />;
//   }

//   const isPrivateProject = !project.isPublic;
//   const isNotMember = !project.member;

//   if (isPrivateProject && isNotMember) {
//     return <JoinProjectModal projectId={projectId} />;
//   }

//   return <>{children}</>;
// }

"use client";

import { useEffect } from "react";
import { useProjectStore } from "@/hooks/useProjectStore";
import { DetailedProject } from "@/lib/schema/ProjectSchema";

export default function ProjectStateWrapper({
  children,
  project,
}: {
  children: React.ReactNode;
  project: DetailedProject;
}) {
  const setProject = useProjectStore((state) => state.setProject);

  useEffect(() => {
    setProject(project);
  }, [project, setProject]);

  return <>{children}</>;
}
