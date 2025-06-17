"use server";

import { auth } from "@/lib/auth";
import { BookmarkActionError } from "@/lib/errors";
import db from "@/server/database";
import { projectBookmarks } from "@/server/database/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

export const toggleProjectBookmark = async (
  projectId: number
): Promise<{ isBookmarked: boolean }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new BookmarkActionError(
        "UNAUTHORIZED",
        "No active session found",
        "toggleProjectBookmark"
      );
    }

    const userId = parseInt(session.user.id);

    const existingBookmark = await db.query.projectBookmarks.findFirst({
      where: and(
        eq(projectBookmarks.projectId, projectId),
        eq(projectBookmarks.userId, userId)
      ),
    });

    // If bookmark exists, remove it
    if (existingBookmark) {
      await db
        .delete(projectBookmarks)
        .where(
          and(
            eq(projectBookmarks.projectId, projectId),
            eq(projectBookmarks.userId, userId)
          )
        );

      return {
        isBookmarked: false,
      };
    }

    // If bookmark doesn't exist, create it
    await db.insert(projectBookmarks).values({
      projectId: projectId,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      isBookmarked: true,
    };
  } catch (error) {
    if (error instanceof BookmarkActionError) {
      throw error;
    }
    throw new BookmarkActionError(
      "DATABASE_ERROR",
      "Failed to toggle quiz bookmark",
      "toggleProjectBookmark"
    );
  }
};
