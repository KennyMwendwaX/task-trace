"use server";

import { auth } from "@/lib/auth";
import { UserActionError } from "@/lib/errors";
import db from "@/server/database";
import { users } from "@/server/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const updateUserProfile = async (
  userId: string,
  profileData: {
    name: string;
    email: string;
  }
): Promise<{ id: number }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "No active session found",
        "updateUserProfile"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new UserActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "updateUserProfile"
      );
    }

    const userIdNum = parseInt(userId);

    const { name, email } = profileData;
    const result = await db
      .update(users)
      .set({
        name: name,
        email: email,
      })
      .where(eq(users.id, userIdNum))
      .returning({
        id: users.id,
      });

    revalidatePath("/settings");
    return result[0];
  } catch (error) {
    console.error("Error in updateUserProfile:", error);

    if (error instanceof UserActionError) {
      throw error;
    }

    throw new UserActionError(
      "DATABASE_ERROR",
      "Failed to update user profile. Please try again later.",
      "updateUserProfile"
    );
  }
};
