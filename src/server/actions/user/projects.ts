"use server";

import { auth } from "@/auth";
import db from "@/database/db";
import { members } from "@/database/schema";
import { MemberProject, PublicProject } from "@/lib/schema/ProjectSchema";
import { eq } from "drizzle-orm";

type ProjectsError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

type ProjectsResponse = {
  data: PublicProject[] | null;
  error?: ProjectsError;
};

export const getProjects = async (
  userId?: string
): Promise<ProjectsResponse> => {
  try {
    const session = await auth();

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
        error: {
          type: "NOT_FOUND",
          message: "No projects found for user",
        },
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
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to fetch projects",
      },
    };
  }
};

type UserProjectsResponse = {
  data: MemberProject[] | null;
  error?: ProjectsError;
};

export const getUserProjects = async (
  userId?: string
): Promise<UserProjectsResponse> => {
  try {
    const session = await auth();

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

    const userProjects = await db.query.members.findMany({
      where: eq(members.userId, userId),
      with: {
        project: {
          with: {
            tasks: {
              columns: {
                status: true,
              },
            },
            members: {
              with: {
                user: {
                  columns: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
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
        error: {
          type: "NOT_FOUND",
          message: "No projects found for user",
        },
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
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to fetch projects",
      },
    };
  }
};
