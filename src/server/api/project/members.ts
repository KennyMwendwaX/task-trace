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
import { MemberActionError } from "@/lib/errors";

export const getProjectMembers = async (
  projectId: string,
  userId?: string
): Promise<ProjectMember[]> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getProjectMembers"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getProjectMembers"
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, parseInt(projectId)),
    });

    if (!project) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Project not found",
        "getProjectMembers"
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, parseInt(projectId)),
        eq(members.userId, parseInt(userId))
      ),
    });

    if (!currentUserMember) {
      throw new MemberActionError(
        "NOT_FOUND",
        "You are not a member of this project",
        "getProjectMembers"
      );
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
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error
        ? error.message
        : "Failed to fetch project members",
      "getProjectMembers"
    );
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
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getMembershipRequests"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getMembershipRequests"
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, parseInt(projectId)),
    });

    if (!project) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Project not found",
        "getMembershipRequests"
      );
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
      throw new MemberActionError(
        "FORBIDDEN",
        "Only project owners or admins can view membership requests",
        "getMembershipRequests"
      );
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
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error
        ? error.message
        : "Failed to fetch project membership requests",
      "getMembershipRequests"
    );
  }
};

export const leaveProject = async (
  projectId: number
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "leaveProject"
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Project not found",
        "leaveProject"
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (!currentUserMember) {
      throw new MemberActionError(
        "NOT_FOUND",
        "You are not a member of this project",
        "leaveProject"
      );
    }

    if (project.ownerId === parseInt(session.user.id)) {
      throw new MemberActionError(
        "FORBIDDEN",
        "Project owners cannot leave the project",
        "leaveProject"
      );
    }

    await db
      .delete(members)
      .where(
        and(
          eq(members.projectId, projectId),
          eq(members.userId, parseInt(session.user.id))
        )
      );

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error leaving project:", error);
    if (error instanceof MemberActionError) {
      throw error;
    }
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to leave project",
      "leaveProject"
    );
  }
};
