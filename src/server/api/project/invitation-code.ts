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

    const existingCode = await db.query.invitationCodes.findFirst({
      where: eq(invitationCodes.projectId, parseInt(projectId)),
    });

    if (!existingCode) {
      return null;
      // throw new Error("No invitation code exists for this project");
    }

    return existingCode;
  } catch (error) {
    console.error("Error fetching project invitation code:", error);
    throw new Error("Failed to fetch project invitation code");
  }
};

type GenerateInvitationCodeResponse = {
  success?: {
    code: string;
    expiresAt: Date | null;
  };
  error?: {
    type: string;
    message: string;
  };
};

export const generateInvitationCode = async (
  projectId: number
): Promise<GenerateInvitationCodeResponse> => {
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
        error: {
          type: "FORBIDDEN",
          message:
            "You don't have permission to generate the project's invitation code",
        },
      };
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

    return {
      success: {
        code: result[0].code,
        expiresAt: result[0].expiresAt,
      },
    };
  } catch (error) {
    console.error("Error generating invitation code:", error);
    return {
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate invitation code",
      },
    };
  }
};
