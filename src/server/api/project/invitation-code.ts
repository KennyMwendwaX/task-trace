"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import {
  InvitationCode,
  invitationCodes,
  members,
  projects,
} from "@/database/schema";
import { add } from "date-fns";
import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { revalidatePath } from "next/cache";
import { InvitationCodeActionError } from "@/lib/errors";

type InvitationCodeError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

export const getProjectInvitationCode = async (
  projectId: string,
  userId?: string
): Promise<InvitationCode | null> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new InvitationCodeActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getProjectInvitationCode"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new InvitationCodeActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getProjectInvitationCode"
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
      throw new InvitationCodeActionError(
        "UNAUTHORIZED",
        "Only project owners or admins can generate invitation codes",
        "getProjectInvitationCode"
      );
    }

    const existingCode = await db.query.invitationCodes.findFirst({
      where: eq(invitationCodes.projectId, parseInt(projectId)),
    });

    if (!existingCode) {
      return null;
    }

    return existingCode;
  } catch (error) {
    console.error("Error fetching project invitation code:", error);
    if (error instanceof InvitationCodeActionError) {
      throw error;
    }
    throw new InvitationCodeActionError(
      "DATABASE_ERROR",
      error instanceof Error
        ? error.message
        : "Failed to fetch project invitation code",
      "getProjectInvitationCode"
    );
  }
};

export const generateInvitationCode = async (
  projectId: number
): Promise<InvitationCode> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new InvitationCodeActionError(
        "UNAUTHORIZED",
        "No active session found",
        "generateInvitationCode"
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      throw new InvitationCodeActionError(
        "NOT_FOUND",
        "Project not found",
        "generateInvitationCode"
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      throw new InvitationCodeActionError(
        "UNAUTHORIZED",
        "Only project's owner and admins can generate invitation code",
        "generateInvitationCode"
      );
    }

    const nanoidCustom = customAlphabet("1234567890", 8);
    const code = nanoidCustom();
    const expiresAt = add(new Date(), { days: 7 });

    const existingCode = await db.query.invitationCodes.findFirst({
      where: eq(invitationCodes.projectId, projectId),
    });

    let result;
    if (!existingCode) {
      result = await db
        .insert(invitationCodes)
        .values({ code, projectId, expiresAt })
        .returning();
    } else {
      result = await db
        .update(invitationCodes)
        .set({ code, expiresAt })
        .where(eq(invitationCodes.projectId, projectId))
        .returning();
    }

    revalidatePath(`/projects/${projectId}`);

    return result[0];
  } catch (error) {
    console.error("Error generating invitation code:", error);
    if (error instanceof InvitationCodeActionError) {
      throw error;
    }
    throw new InvitationCodeActionError(
      "DATABASE_ERROR",
      error instanceof Error
        ? error.message
        : "Failed to generate invitation code",
      "generateInvitationCode"
    );
  }
};
