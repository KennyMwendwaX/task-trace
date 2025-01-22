"use server";

import { auth } from "@/auth";
import db from "@/database/db";
import { members, projects } from "@/database/schema";
import {
  DetailedProject,
  Project,
  ProjectFormValues,
} from "@/lib/schema/ProjectSchema";
import { and, eq } from "drizzle-orm";

type ProjectError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

type ProjectResponse = {
  data: DetailedProject | null;
  error?: ProjectError;
};

export const getProject = async (
  projectId: string,
  userId?: string
): Promise<ProjectResponse> => {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        data: null,
        error: {
          type: "UNAUTHORIZED",
          message: "No active session found",
        },
      };
    }

    if (!userId || userId !== session.user.id) {
      return {
        data: null,
        error: {
          type: "UNAUTHORIZED",
          message: "User ID mismatch or missing",
        },
      };
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(eq(members.projectId, projectId), eq(members.userId, userId)),
    });

    if (!currentUserMember) {
      return {
        data: null,
        error: {
          type: "UNAUTHORIZED",
          message: "User is not a member of this project",
        },
      };
    }

    const projectData = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
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
      return {
        data: null,
        error: {
          type: "NOT_FOUND",
          message: "Project not found",
        },
      };
    }

    const project = {
      ...projectData,
      member: currentUserMember
        ? {
            id: currentUserMember.id,
            role: currentUserMember.role,
          }
        : null,
    };

    return {
      data: project,
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    return {
      data: null,
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to fetch project",
      },
    };
  }
};

type UpdateProjectResponse = {
  success: boolean;
  error?: ProjectError;
};

export const updateProject = async (
  userId: string,
  projectId: string,
  formValues: ProjectFormValues
): Promise<UpdateProjectResponse> => {
  try {
    const session = await auth();

    if (!session?.user) {
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
