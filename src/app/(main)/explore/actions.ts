"use server";

import { auth } from "@/auth";
import db from "@/database/db";

export const getProjects = async (userId?: string) => {
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

    const projectsResult = await db.query.projects.findMany({
      with: {
        tasks: true,
        members: {
          with: {
            user: true,
          },
          limit: 3,
        },
      },
    });

    if (!projectsResult || projectsResult.length === 0) {
      return {
        data: [],
      };
    }

    const projects = projectsResult.map((project) => {
      const { tasks, ...projectWithoutTasks } = project;
      const totalTasksCount = tasks.length;
      const completedTasksCount = tasks.filter(
        (task) => task.status === "DONE"
      ).length;

      return {
        ...projectWithoutTasks,
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
    console.error("Error fetching projects:", error);
    return {
      error: "Failed to fetch projects",
    };
  }
};
