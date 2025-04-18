"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import { members, Task } from "@/database/schema";
import { eq } from "drizzle-orm";
import { TaskActionError } from "@/lib/errors";

export async function getUserTasks(userId?: string): Promise<Task[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new TaskActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getUserTasks"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new TaskActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getUserTasks"
      );
    }

    const userTasks = await db.query.members.findMany({
      where: eq(members.userId, parseInt(userId)),
      with: {
        tasks: true,
      },
    });

    if (!userTasks || userTasks.length === 0) {
      return [];
    }

    const tasks = userTasks.flatMap((member) => member.tasks);
    return tasks;
  } catch (error) {
    console.error("Error in getUserTasks:", error);
    if (error instanceof TaskActionError) {
      throw error;
    }
    throw new TaskActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to get user tasks",
      "getUserTasks"
    );
  }
}
