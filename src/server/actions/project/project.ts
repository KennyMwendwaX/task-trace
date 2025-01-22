"use server";

import { auth } from "@/auth";
import db from "@/database/db";
import { members, projects } from "@/database/schema";
import { DetailedProject } from "@/lib/schema/ProjectSchema";
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
