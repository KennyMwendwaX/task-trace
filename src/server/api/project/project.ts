"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import {
  DetailedProject,
  members,
  projects,
  PublicProject,
} from "@/database/schema";
import { ProjectFormValues } from "@/lib/schema/ProjectSchema";
import { and, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ProjectActionError } from "@/lib/errors";

type ProjectError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

export const getProject = async (
  projectId: string,
  userId?: string
): Promise<DetailedProject> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getProject"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getProject"
      );
    }

    // Check if project exists FIRST
    const projectData = await db.query.projects.findFirst({
      where: eq(projects.id, parseInt(projectId)),
      with: {
        owner: {
          columns: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!projectData) {
      throw new ProjectActionError(
        "NOT_FOUND",
        "Project not found",
        "getProject"
      );
    }

    // Then check membership
    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, parseInt(projectId)),
        eq(members.userId, parseInt(userId))
      ),
    });

    if (!currentUserMember) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "User is not a member of the project",
        "getProject"
      );
    }

    const project: DetailedProject = {
      ...projectData,
      member: {
        id: currentUserMember.id,
        role: currentUserMember.role,
        createdAt: currentUserMember.createdAt,
        updatedAt: currentUserMember.updatedAt,
        userId: currentUserMember.userId,
        projectId: currentUserMember.projectId,
      },
    };

    return project;
  } catch (error) {
    console.error("Error in getProject:", error);
    if (error instanceof ProjectActionError) {
      throw error;
    }
    throw new ProjectActionError(
      "DATABASE_ERROR",
      "Failed to fetch project",
      "getProject"
    );
  }
};

export async function getProjects(userId?: string): Promise<PublicProject[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("No active session found");
    }

    if (!userId || userId !== session.user.id) {
      throw new Error("User ID mismatch or missing");
    }

    const projectsResult = await db.query.projects.findMany({
      with: {
        tasks: true,
        members: {
          with: {
            user: true,
          },
          limit: 3,
        },
      },
    });

    if (!projectsResult || projectsResult.length === 0) {
      return [];
    }

    const projects = projectsResult.map((project) => {
      const { tasks, ...projectWithoutTasks } = project;
      const totalTasksCount = tasks.length;
      const completedTasksCount = tasks.filter(
        (task) => task.status === "DONE"
      ).length;

      return {
        ...projectWithoutTasks,
        totalTasksCount,
        completedTasksCount,
        memberCount: project.members.length,
        members: project.members.map(({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        })),
      };
    });

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

type UpdateProjectResponse = {
  success: boolean;
  error?: ProjectError;
};

export const updateProject = async (
  userId?: string,
  projectId: number,
  formValues: ProjectFormValues
): Promise<UpdateProjectResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return {
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "No active session found",
        },
      };
    }

    if (!userId || userId !== session.user.id) {
      return {
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "User ID mismatch or missing",
        },
      };
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return {
        success: false,
        error: {
          type: "NOT_FOUND",
          message: "Project not found",
        },
      };
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, session.user.id)
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      return {
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "Only project owners or admins can update project details.",
        },
      };
    }

    const updatedProject = await db
      .update(projects)
      .set({
        name: formValues.name,
        status: formValues.status,
        description: formValues.description,
      })
      .where(eq(projects.id, projectId))
      .returning();

    if (updatedProject.length === 0) {
      return {
        success: false,
        error: {
          type: "DATABASE_ERROR",
          message: "Failed to update project",
        },
      };
    }

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      success: false,
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to update project",
      },
    };
  }
};

type DeleteProjectResponse = {
  success?: boolean;
  error?: {
    type: string;
    message: string;
  };
};

export const deleteProject = async (
  projectId: number
): Promise<DeleteProjectResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return {
        error: {
          type: "UNAUTHORIZED",
          message: "No active session found",
        },
      };
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return {
        error: {
          type: "NOT_FOUND",
          message: "Project not found",
        },
      };
    }

    if (project.ownerId !== session.user.id) {
      return {
        error: {
          type: "FORBIDDEN",
          message: "Only the project owner can delete the project",
        },
      };
    }

    await db.delete(projects).where(eq(projects.id, projectId));

    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to delete project",
      },
    };
  }
};

type ToggleVisibilityResponse = {
  success?: boolean;
  error?: {
    type: string;
    message: string;
  };
};

export const toggleProjectVisibility = async (
  projectId: number,
  isPublic: boolean
): Promise<ToggleVisibilityResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return {
        error: {
          type: "UNAUTHORIZED",
          message: "No active session found",
        },
      };
    }

    const userMembership = await db.query.members.findFirst({
      where: and(
        eq(members.userId, session.user.id),
        eq(members.projectId, projectId),
        or(eq(members.role, "OWNER"), eq(members.role, "ADMIN"))
      ),
    });

    if (!userMembership) {
      return {
        error: {
          type: "FORBIDDEN",
          message: "Access denied",
        },
      };
    }

    const updatedProject = await db
      .update(projects)
      .set({ isPublic })
      .where(eq(projects.id, projectId))
      .returning();

    if (updatedProject.length === 0) {
      return {
        error: {
          type: "NOT_FOUND",
          message: "Project not found",
        },
      };
    }

    revalidatePath(`/projects/${projectId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Error updating project visibility:", error);
    return {
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Server error, try again later",
      },
    };
  }
};
