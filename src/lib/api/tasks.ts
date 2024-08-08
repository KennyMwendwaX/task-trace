import axios from "axios";
import { ProjectTask, UserTask } from "../schema/TaskSchema";

export const fetchTask = async (
  projectId: string,
  taskId: string
): Promise<ProjectTask> => {
  if (!projectId || !taskId) throw new Error("No project ID or task ID");
  try {
    const { data } = await axios.get<{ task: ProjectTask }>(
      `/api/projects/${projectId}/tasks/${taskId}`
    );
    return {
      ...data.task,
      dueDate: new Date(data.task.dueDate),
      createdAt: new Date(data.task.createdAt),
      updatedAt: data.task.updatedAt ? new Date(data.task.updatedAt) : null,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch task: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const fetchUserTasks = async (
  userId: string | undefined
): Promise<UserTask[]> => {
  if (!userId) throw new Error("User ID not found");
  try {
    const { data } = await axios.get<{ tasks: UserTask[] }>(
      `/api/users/${userId}/tasks`
    );
    return data.tasks
      .map((task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : null,
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user tasks: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const fetchProjectTasks = async (projectId: string) => {
  if (!projectId) throw new Error("No project ID");
  try {
    const { data } = await axios.get<{ tasks: ProjectTask[] }>(
      `/api/projects/${projectId}/tasks`
    );
    return data.tasks
      .map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : null,
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch project tasks: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
