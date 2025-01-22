"use server";

import { auth } from "@/auth";
import db from "@/database/db";
import { invitationCodes, members } from "@/database/schema";
import { add } from "date-fns";
import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

type InvitationCodeError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

type InvitationCodeResponse = {
  data: { code: string; expiresAt: Date | null } | null;
  error?: InvitationCodeError;
};

export const getProjectInvitationCode = async (
  projectId: string,
  userId?: string
): Promise<InvitationCodeResponse> => {
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

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      return {
        data: null,
        error: {
          type: "UNAUTHORIZED",
          message:
            "Only project owners or admins can generate invitation codes",
        },
      };
    }

    const nanoidCustom = customAlphabet("0123456789", 8);
    const code = nanoidCustom();
    const expiresAt = add(new Date(), { days: 7 });

    const existingCode = await db.query.invitationCodes.findFirst({
      where: eq(invitationCodes.projectId, projectId),
    });

    if (!existingCode) {
      await db.insert(invitationCodes).values({ code, projectId, expiresAt });
      return {
        data: { code, expiresAt },
      };
    }

    const updatedCode = await db
      .update(invitationCodes)
      .set({ code, expiresAt })
      .where(eq(invitationCodes.projectId, projectId))
      .returning();

    if (updatedCode.length === 0) {
      return {
        data: null,
        error: {
          type: "DATABASE_ERROR",
          message: "Failed to update the invitation code",
        },
      };
    }

    return {
      data: { code: updatedCode[0].code, expiresAt: updatedCode[0].expiresAt },
    };
  } catch (error) {
    console.error("Error fetching project invitation code:", error);
    return {
      data: null,
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch project invitation code",
      },
    };
  }
};
