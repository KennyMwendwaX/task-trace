"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/server/database";
import { invitationCodes, members } from "@/server/database/schema";
import { eq, and } from "drizzle-orm";
import { MemberActionError } from "@/lib/errors";
import { z } from "zod";

const codeSchema = z.object({
  code: z.string().min(1, "Invitation code is required"),
});

export const joinWithCode = async (
  code: string
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "joinWithCode"
      );
    }

    const validation = codeSchema.safeParse({ code });
    if (!validation.success) {
      throw new MemberActionError(
        "FORBIDDEN",
        "Invalid invitation code format",
        "joinWithCode"
      );
    }

    const invitationCode = await db.query.invitationCodes.findFirst({
      where: eq(invitationCodes.code, code),
    });

    if (!invitationCode) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Invalid invitation code",
        "joinWithCode"
      );
    }

    const currentDateTime = new Date();
    if (
      invitationCode.expiresAt &&
      invitationCode.expiresAt < currentDateTime
    ) {
      throw new MemberActionError(
        "FORBIDDEN",
        "Invitation code expired",
        "joinWithCode"
      );
    }

    const projectId = invitationCode.projectId;

    const existingMember = await db.query.members.findFirst({
      where: and(
        eq(members.userId, parseInt(session.user.id)),
        eq(members.projectId, projectId)
      ),
    });

    if (existingMember) {
      throw new MemberActionError(
        "FORBIDDEN",
        "You are already a member of this project",
        "joinWithCode"
      );
    }

    // Add user as a member
    const result = await db
      .insert(members)
      .values({
        userId: parseInt(session.user.id),
        projectId: projectId,
        role: "MEMBER",
      })
      .returning({ id: members.id });

    if (result.length === 0) {
      throw new MemberActionError(
        "DATABASE_ERROR",
        "Failed to join project",
        "joinWithCode"
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error joining project with code:", error);
    if (error instanceof MemberActionError) {
      throw error;
    }
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to join project",
      "joinWithCode"
    );
  }
};
