"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import {
  members,
  membershipRequests,
  projects,
  ProjectMember,
  ProjectMembershipRequest,
} from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type MemberError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "FORBIDDEN"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

export const getProjectMembers = async (
  projectId: string,
  userId?: string
): Promise<ProjectMember[]> => {
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

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, parseInt(projectId)),
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, parseInt(projectId)),
        eq(members.userId, parseInt(userId))
      ),
    });

    if (!currentUserMember) {
      throw new Error("User is not a member of the project");
    }

    const projectMembers = await db.query.members.findMany({
      where: eq(members.projectId, parseInt(projectId)),
      with: {
        user: {
          columns: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return projectMembers;
  } catch (error) {
    console.error("Error fetching project members:", error);
    throw new Error("Error fetching project members");
  }
};

export const getMembershipRequests = async (
  projectId: string,
  userId?: string
): Promise<ProjectMembershipRequest[]> => {
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

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, parseInt(projectId)),
        eq(members.userId, parseInt(userId))
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      throw new Error(
        "Only project owners or admins can generate invitation codes"
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, parseInt(projectId)),
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const requests = await db.query.membershipRequests.findMany({
      where: eq(membershipRequests.projectId, parseInt(projectId)),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return requests;
  } catch (error) {
    console.error("Error fetching project membership request:", error);
    throw new Error("Failed to fetch project membership requests");
  }
};

type LeaveProjectResponse = {
  success?: boolean;
  error?: {
    type: string;
    message: string;
  };
};

export const leaveProject = async (
  projectId: number
): Promise<LeaveProjectResponse> => {
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

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, session.user.id)
      ),
    });

    if (!currentUserMember) {
      return {
        error: {
          type: "NOT_FOUND",
          message: "You are not a member of this project",
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

    if (project.ownerId === session.user.id) {
      return {
        error: {
          type: "FORBIDDEN",
          message: "Project owner cannot leave. Transfer ownership first.",
        },
      };
    }

    await db
      .delete(members)
      .where(
        and(
          eq(members.projectId, projectId),
          eq(members.userId, session.user.id)
        )
      );

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error leaving project:", error);
    return {
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to leave project",
      },
    };
  }
};
