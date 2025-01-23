"use server";

import { auth } from "@/auth";
import db from "@/database/db";
import { invitationCodes, members, projects } from "@/database/schema";
import { add } from "date-fns";
import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { revalidatePath } from "next/cache";

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
          message: "Only project owners or admins can view invitation codes",
        },
      };
    }

    const existingCode = await db.query.invitationCodes.findFirst({
      where: eq(invitationCodes.projectId, projectId),
    });

    if (!existingCode) {
      return {
        data: null,
        error: {
          type: "NOT_FOUND",
          message: "No invitation code exists for this project",
        },
      };
    }

    return {
      data: {
        code: existingCode.code,
        expiresAt: existingCode.expiresAt,
      },
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
  projectId: string
): Promise<GenerateInvitationCodeResponse> => {
  try {
    const session = await auth();

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
