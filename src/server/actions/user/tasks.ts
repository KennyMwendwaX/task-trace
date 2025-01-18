"use server";

import { auth } from "@/auth";
import db from "@/database/db";
import { members } from "@/database/schema";
import { UserTask } from "@/lib/schema/TaskSchema";
import { eq } from "drizzle-orm";

export const getUserTasks = async (
  userId?: string
): Promise<{ data: UserTask[] | null; error?: string }> => {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        data: null,
        error: "Unauthorized access",
      };
    }

    if (!userId || userId !== session.user.id) {
      return {
        data: null,
        error: "Unauthorized access",
      };
    }

    const userTasks = await db.query.members.findMany({
      where: eq(members.userId, userId),
      with: {
        tasks: true,
      },
    });

    if (!userTasks || userTasks.length === 0) {
      return {
        data: [],
      };
    }

    const tasks = userTasks.flatMap((member) => member.tasks);

    return {
      data: tasks,
    };
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return {
      data: null,
      error: "Failed to fetch tasks",
    };
  }
};
