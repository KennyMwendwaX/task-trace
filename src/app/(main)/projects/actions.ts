"use server";

import { auth } from "@/auth";
import db from "@/database/db";
import { members } from "@/database/schema";
import { eq } from "drizzle-orm";

export const getUserProjects = async (userId?: string) => {
  try {
    // Authentication check
    const session = await auth();

    if (!session?.user) {
      return {
        error: "Unauthorized access",
      };
    }

    // Verify the requested userId matches the authenticated user
    if (!userId || userId !== session.user.id) {
      return {
        error: "Unauthorized access",
      };
    }

    const userProjects = await db.query.members.findMany({
      where: eq(members.userId, userId),
      with: {
        project: {
          with: {
            tasks: true,
            members: {
              with: {
                user: true,
              },
              limit: 3,
            },
          },
        },
      },
    });

    if (!userProjects || userProjects.length === 0) {
      return {
        data: [],
      };
    }

    const projects = userProjects.map(({ project, role }) => {
      const { tasks, ...projectWithoutTasks } = project;
      const totalTasksCount = tasks.length;
      const completedTasksCount = tasks.filter(
        (task) => task.status === "DONE"
      ).length;
      return {
        ...projectWithoutTasks,
        memberRole: role,
        totalTasksCount,
        completedTasksCount,
        memberCount: project.members.length,
        members: project.members.map(({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        })),
      };
    });

    return {
      data: projects,
    };
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return {
      error: "Failed to fetch tasks",
    };
  }
};
