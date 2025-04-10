"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import { members } from "@/database/schema";
import { UserTask } from "@/lib/schema/TaskSchema";
import { eq } from "drizzle-orm";

type TasksError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

type TasksResponse = {
  data: UserTask[] | null;
  error?: TasksError;
};

export const getUserTasks = async (userId?: string): Promise<TasksResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
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

    const userTasks = await db.query.members.findMany({
      where: eq(members.userId, userId),
      with: {
        tasks: true,
      },
    });

    if (!userTasks || userTasks.length === 0) {
      return {
        data: [],
        error: {
          type: "NOT_FOUND",
          message: "No tasks found for user",
        },
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
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to fetch tasks",
      },
    };
  }
};
