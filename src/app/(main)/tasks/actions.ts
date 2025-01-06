"use server";

import { auth } from "@/auth";
import db from "@/database/db";
import { members } from "@/database/schema";
import { eq } from "drizzle-orm";

export const getUserTasks = async (userId?: string) => {
  try {
    const session = await auth();

    if (!session?.user) {
      return {
        error: "Unauthorized access",
      };
    }

    if (!userId || userId !== session.user.id) {
      return {
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
      error: "Failed to fetch tasks",
    };
  }
};
