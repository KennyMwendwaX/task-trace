import axios from "axios";
import {
  DetailedProject,
  PublicProject,
  MemberProject,
} from "../schema/ProjectSchema";
import { InvitationCode } from "../schema/InvitationCodeSchema";
import { ProjectMembershipRequest } from "../schema/MembershipRequests";

export const fetchProject = async (
  projectId: string
): Promise<DetailedProject> => {
  if (!projectId) throw new Error("No project ID");
  try {
    const { data } = await axios.get<{ project: DetailedProject }>(
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
): Promise<MemberProject[]> => {
  if (!userId) throw new Error("User ID not found");
  try {
    const { data } = await axios.get<{ projects: MemberProject[] }>(
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

export const fetchProjects = async (): Promise<PublicProject[]> => {
  try {
    const { data } = await axios.get<{ projects: PublicProject[] }>(
      "/api/projects"
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
      throw new Error(`Failed to fetch projects: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const fetchRequests = async (
  projectId: string
): Promise<ProjectMembershipRequest[]> => {
  try {
    const { data } = await axios.get<{ requests: ProjectMembershipRequest[] }>(
      `/api/projects/${projectId}/membership-requests`
    );
    return data.requests
      .map((request) => ({
        ...request,
        createdAt: new Date(request.createdAt),
        updatedAt: request.updatedAt ? new Date(request.updatedAt) : null,
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

export const toggleProjectVisibility = async (
  projectId: string,
  isPublic: boolean
) => {
  const options = {
    method: "PATCH",
    body: JSON.stringify({ isPublic }),
  };

  const response = await fetch(
    `/api/projects/${projectId}/visibility`,
    options
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error updating project visibility");
  }
};

export const getInvitationCode = async (
  projectId: string
): Promise<InvitationCode> => {
  const response = await fetch(`/api/projects/${projectId}/invitation-code`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get invitation code.");
  }
  return response.json();
};

export const generateInvitationCode = async (
  projectId: string
): Promise<InvitationCode> => {
  const response = await fetch(`/api/projects/${projectId}/invitation-code`, {
    method: "POST",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to generate invitation code.");
  }
  return response.json();
};

export const regenerateInvitationCode = async (
  projectId: string
): Promise<InvitationCode> => {
  const response = await fetch(`/api/projects/${projectId}/invitation-code`, {
    method: "PUT",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to re-generate invitation code."
    );
  }
  return response.json();
};

export const leaveProject = async (projectId: string) => {
  const response = await fetch(`/api/projects/${projectId}/leave`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to leave the project.");
  }
  return response.json();
};

export const deleteProject = async (projectId: string) => {
  const response = await fetch(`/api/project/${projectId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete the project.");
  }
  return response.json();
};
