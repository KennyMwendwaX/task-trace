"use server";

import { auth } from "@/auth";
import db from "@/database/db";
import { members } from "@/database/schema";
import { MemberProject, PublicProject } from "@/lib/schema/ProjectSchema";
import { eq } from "drizzle-orm";

export const getProjects = async (
  userId?: string
): Promise<{ data: PublicProject[] | null; error?: string }> => {
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
      data: null,
      error: "Failed to fetch projects",
    };
  }
};

export const getUserProjects = async (
  userId?: string
): Promise<{ data: MemberProject[] | null; error?: string }> => {
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
    console.error("Error fetching user projects:", error);
    return {
      data: null,
      error: "Failed to fetch projects",
    };
  }
};
