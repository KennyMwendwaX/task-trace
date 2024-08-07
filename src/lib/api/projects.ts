import axios from "axios";
import { Project } from "../schema/ProjectSchema";
import { ProjectRole } from "../config";

interface UserProject extends Project {
  memberRole: ProjectRole;
}

export const fetchProject = async (projectId: string): Promise<Project> => {
  if (!projectId) throw new Error("No project ID");
  try {
    const { data } = await axios.get<{ project: Project }>(
      `/api/projects/${projectId}`
    );
    return {
      ...data.project,
      createdAt: new Date(data.project.createdAt),
      updatedAt: data.project.updatedAt
        ? new Date(data.project.updatedAt)
        : null,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch project: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const fetchUserProjects = async (
  userId: string | undefined
): Promise<UserProject[]> => {
  if (!userId) throw new Error("User ID not found");
  try {
    const { data } = await axios.get<{ projects: UserProject[] }>(
      `/api/users/${userId}/projects`
    );
    return data.projects
      .map((project) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: project.updatedAt ? new Date(project.updatedAt) : null,
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user member projects: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const fetchPublicProjects = async (): Promise<Project[]> => {
  try {
    const { data } = await axios.get<{ publicProjects: Project[] }>(
      "/api/projects"
    );
    return data.publicProjects
      .map((project) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: project.updatedAt ? new Date(project.updatedAt) : null,
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
