"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import { membershipRequests, projects } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { MemberActionError } from "@/lib/errors";
import { members } from "@/database/schema";

export const createMembershipRequest = async (
  projectId: string | number
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "createMembershipRequest"
      );
    }

    const numericProjectId =
      typeof projectId === "string" ? parseInt(projectId) : projectId;

    // Check if project exists
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, numericProjectId),
    });

    if (!project) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Project not found",
        "createMembershipRequest"
      );
    }

    // Check if user is already a member of the project
    const existingMembership = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, numericProjectId),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (existingMembership) {
      throw new MemberActionError(
        "FORBIDDEN",
        "You are already a member of this project",
        "createMembershipRequest"
      );
    }

    // Check if user already has a pending request
    const existingRequest = await db.query.membershipRequests.findFirst({
      where: and(
        eq(membershipRequests.projectId, numericProjectId),
        eq(membershipRequests.requesterId, parseInt(session.user.id))
      ),
    });

    if (existingRequest) {
      throw new MemberActionError(
        "FORBIDDEN",
        "You already have a pending request for this project",
        "createMembershipRequest"
      );
    }

    // Create new membership request
    const result = await db
      .insert(membershipRequests)
      .values({
        projectId: numericProjectId,
        requesterId: parseInt(session.user.id),
        status: "PENDING",
      })
      .returning({ id: membershipRequests.id });

    if (result.length === 0) {
      throw new MemberActionError(
        "DATABASE_ERROR",
        "Failed to create membership request",
        "createMembershipRequest"
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error creating membership request:", error);
    if (error instanceof MemberActionError) {
      throw error;
    }
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error
        ? error.message
        : "Failed to create membership request",
      "createMembershipRequest"
    );
  }
};
