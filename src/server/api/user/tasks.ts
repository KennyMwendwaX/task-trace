"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import { members, Task } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function getUserTasks(userId?: string): Promise<Task[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("No active session found");
    }

    if (!userId || userId !== session.user.id) {
      throw new Error("User ID mismatch or missing");
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
    throw error;
  }
}
