import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useProjectStore } from "./useProjectStore";
import { Project } from "@/lib/schema/ProjectSchema";
import { ProjectTask } from "@/lib/schema/TaskSchema";
import { Member } from "@/lib/schema/MemberSchema";
import { fetchProject, fetchPublicProjects } from "@/lib/api/projects";
import { fetchProjectMembers } from "@/lib/api/members";
import { fetchProjectTasks } from "@/lib/api/tasks";
import { useEffect } from "react";

export const useProjectQuery = (
  projectId: string
): UseQueryResult<Project, Error> => {
  const setProject = useProjectStore((state) => state.setProject);
  const result = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });

  useEffect(() => {
    if (result.data) {
      setProject(result.data);
    }
  }, [result.data, setProject]);

  return result;
};

export const usePublicProjectsQuery = (): UseQueryResult<Project[], Error> => {
  const setPublicProjects = useProjectStore((state) => state.setPublicProjects);
  const result = useQuery({
    queryKey: ["public-projects"],
    queryFn: () => fetchPublicProjects(),
  });

  useEffect(() => {
    if (result.data) {
      setPublicProjects(result.data);
    }
  }, [result.data, setPublicProjects]);

  return result;
};

export const useProjectMembersQuery = (
  projectId: string
): UseQueryResult<Member[], Error> => {
  const setMembers = useProjectStore((state) => state.setMembers);
  const result = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => fetchProjectMembers(projectId),
    enabled: !!projectId,
  });

  useEffect(() => {
    if (result.data) {
      setMembers(result.data);
    }
  }, [result.data, setMembers]);

  return result;
};

export const useProjectTasksQuery = (
  projectId: string
): UseQueryResult<ProjectTask[], Error> => {
  const setProjectTasks = useProjectStore((state) => state.setProjectTasks);
  const result = useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: () => fetchProjectTasks(projectId),
    enabled: !!projectId,
  });

  useEffect(() => {
    if (result.data) {
      setProjectTasks(result.data);
    }
  }, [result.data, setProjectTasks]);

  return result;
};
