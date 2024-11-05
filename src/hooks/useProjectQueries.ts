import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { useProjectStore } from "./useProjectStore";
import {
  DetailedProject,
  PublicProject,
  ProjectFormValues,
} from "@/lib/schema/ProjectSchema";
import { ProjectTask, TaskFormValues } from "@/lib/schema/TaskSchema";
import { Member } from "@/lib/schema/MemberSchema";
import {
  deleteProject,
  fetchProject,
  fetchProjects,
  generateInvitationCode,
  getInvitationCode,
  leaveProject,
  regenerateInvitationCode,
} from "@/lib/api/projects";
import { fetchProjectMembers } from "@/lib/api/members";
import { fetchProjectTasks, fetchTask } from "@/lib/api/tasks";
import { useEffect } from "react";
import { InvitationCode } from "@/lib/schema/InvitationCodeSchema";

export const useProjectQuery = (
  projectId: string
): UseQueryResult<DetailedProject, Error> => {
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

export const useProjectsQuery = (): UseQueryResult<PublicProject[], Error> => {
  const setProjects = useProjectStore((state) => state.setProjects);
  const result = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(),
  });

  useEffect(() => {
    if (result.data) {
      setProjects(result.data);
    }
  }, [result.data, setProjects]);

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

export const useProjectTaskQuery = (
  projectId: string,
  taskId: string
): UseQueryResult<ProjectTask, Error> => {
  const setProjectTask = useProjectStore((state) => state.setProjectTask);
  const result = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTask(projectId, taskId),
    enabled: !!projectId && !!taskId,
  });

  useEffect(() => {
    if (result.data) {
      setProjectTask(result.data);
    }
  }, [result.data, setProjectTask]);

  return result;
};

export const useAddProjectMutation = (): UseMutationResult<
  { projectId: string },
  Error,
  ProjectFormValues
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const options = {
        method: "POST",
        body: JSON.stringify(values),
      };
      const response = await fetch("/api/projects", options);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      return { projectId: data.projectId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-projects"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useAddProjectTaskMutation = (
  projectId: string
): UseMutationResult<void, Error, TaskFormValues> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: TaskFormValues) => {
      const options = {
        method: "POST",
        body: JSON.stringify(values),
      };
      const response = await fetch(`/api/projects/${projectId}/tasks`, options);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project-tasks", projectId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateProjectTaskMutation = (
  projectId: string,
  task: ProjectTask | null
): UseMutationResult<void, Error, TaskFormValues> => {
  const queryClient = useQueryClient();
  if (!task) throw new Error("No task ID or task data");

  return useMutation({
    mutationFn: async (values: TaskFormValues) => {
      const options = {
        method: "PUT",
        body: JSON.stringify(values),
      };
      const response = await fetch(
        `/api/projects/${projectId}/tasks/${task.id}`,
        options
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", task.id],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useProjectInvitationCodeQuery = (
  projectId: string
): UseQueryResult<InvitationCode, Error> => {
  const setProjectInvitationCode = useProjectStore(
    (state) => state.setInvitationCode
  );
  const result = useQuery({
    queryKey: ["invitation-code", projectId],
    queryFn: () => getInvitationCode(projectId),
    enabled: !!projectId,
  });

  useEffect(() => {
    if (result.data) {
      const parsedCode: InvitationCode = {
        ...result.data,
        expiresAt: result.data.expiresAt
          ? new Date(result.data.expiresAt)
          : null,
      };
      setProjectInvitationCode(parsedCode);
    }
  }, [result.data, setProjectInvitationCode]);

  return result;
};

export const useGenerateInvitationCodeMutation = (
  projectId: string
): UseMutationResult<InvitationCode, Error, string> => {
  const queryClient = useQueryClient();
  if (!projectId) throw new Error("No project ID");

  return useMutation({
    mutationFn: () => generateInvitationCode(projectId),
    onSuccess: (data) => {
      queryClient.setQueryData(["invitation-code", projectId], data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useRegenerateInvitationCodeMutation = (
  projectId: string
): UseMutationResult<InvitationCode, Error, string> => {
  const queryClient = useQueryClient();
  if (!projectId) throw new Error("No project ID");

  return useMutation({
    mutationFn: () => regenerateInvitationCode(projectId),
    onSuccess: (data) => {
      queryClient.setQueryData(["invitation-code", projectId], data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useLeaveProjectMutation = (
  projectId: string,
  userId: string | undefined
) => {
  const queryClient = useQueryClient();
  if (!projectId || !userId) throw new Error("No project or user ID");

  return useMutation({
    mutationFn: () => leaveProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-projects", userId] });
    },
    onError: (error: Error) => {
      console.log(error);
    },
  });
};

export const useDeleteProjectMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  if (!projectId) throw new Error("No project ID");

  return useMutation({
    mutationFn: () => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => {
      console.log(error);
    },
  });
};
