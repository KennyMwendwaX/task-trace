"use server";

import { auth } from "@/auth";
import db from "@/database/db";
import { members, tasks } from "@/database/schema";
import { ProjectTask } from "@/lib/schema/TaskSchema";
import { and, eq } from "drizzle-orm";

export const getTask = async (
  projectId: string,
  taskId: string,
  userId?: string
): Promise<{ data: ProjectTask | null; error?: string }> => {
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

    const currentUserMember = await db.query.members.findFirst({
      where: and(eq(members.projectId, projectId), eq(members.userId, userId)),
    });

    if (!currentUserMember) {
      return {
        data: null,
        error: "You are not a member of the project",
      };
    }

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
      with: {
        member: {
          columns: {
            role: true,
          },
          with: {
            user: {
              columns: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      return { data: null, error: "Task not found" };
    }

    return {
      data: task,
    };
  } catch (error) {
    console.error("Error fetching task:", error);
    return {
      data: null,
      error: "Failed to fetch task",
    };
  }
};
