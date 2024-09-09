import { SignupValues, User } from "@/lib/schema/UserSchema";
import { useUserStore } from "./useUserStore";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api/users";
import { useEffect } from "react";
import { fetchUserProjects } from "@/lib/api/projects";
import { UserProject } from "@/lib/schema/ProjectSchema";
import { UserTask } from "@/lib/schema/TaskSchema";
import { fetchUserTasks } from "@/lib/api/tasks";

interface SignupResponse {
  message: string;
}

interface SignupError {
  message: string;
}

export const useUsersQuery = (): UseQueryResult<User[], Error> => {
  const setUsers = useUserStore((state) => state.setUsers);
  const result = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  useEffect(() => {
    if (result.data) {
      setUsers(result.data);
    }
  }, [result.data, setUsers]);

  return result;
};

export const useUsersProjectsQuery = (
  userId: string | undefined
): UseQueryResult<UserProject[], Error> => {
  const setUserProjects = useUserStore((state) => state.setUserProjects);
  const result = useQuery({
    queryKey: ["user-projects", userId],
    queryFn: () => fetchUserProjects(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (result.data) {
      setUserProjects(result.data);
    }
  }, [result.data, setUserProjects]);

  return result;
};

export const useUsersTasksQuery = (
  userId: string | undefined
): UseQueryResult<UserTask[], Error> => {
  const setUserTasks = useUserStore((state) => state.setUserTasks);
  const result = useQuery({
    queryKey: ["user-tasks", userId],
    queryFn: () => fetchUserTasks(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (result.data) {
      setUserTasks(result.data);
    }
  }, [result.data, setUserTasks]);

  return result;
};

export const useUserSignupMutation = (): UseMutationResult<
  SignupResponse,
  SignupError,
  SignupValues,
  unknown
> => {
  return useMutation<SignupResponse, SignupError, SignupValues, unknown>({
    mutationFn: async (values: SignupValues) => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      };
      const response = await fetch("/api/auth/register", options);

      if (!response.ok) {
        const error: SignupError = await response.json();
        throw error;
      }

      return response.json();
    },
  });
};
