"use server";

import { auth } from "@/lib/auth";
import { UserActionError } from "@/lib/errors";
import db from "@/server/database";
import { users } from "@/server/database/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export const deleteUserAccount = async (
  userId: string
): Promise<{ success: boolean }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "No active session found",
        "deleteUserAccount"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "deleteUserAccount"
      );
    }

    const userIdNum = parseInt(userId);

    await db.delete(users).where(eq(users.id, userIdNum));

    return { success: true };
  } catch (error) {
    console.error("Error in deleteUserAccount:", error);

    if (error instanceof UserActionError) {
      throw error;
    }

    throw new UserActionError(
      "DATABASE_ERROR",
      "Failed to delete user account. Please try again later.",
      "deleteUserAccount"
    );
  }
};
