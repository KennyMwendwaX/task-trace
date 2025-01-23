"use server";

import { auth } from "@/auth";
import db from "@/database/db";
import { members, projects, tasks } from "@/database/schema";
import { ProjectTask, TaskFormValues } from "@/lib/schema/TaskSchema";
import { and, eq } from "drizzle-orm";

type TasksError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

type TasksResponse = {
  data: ProjectTask[] | null;
  error?: TasksError;
};

export const getProjectTasks = async (
  projectId: string,
  userId?: string
): Promise<TasksResponse> => {
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

    const currentUserMember = await db.query.members.findFirst({
      where: and(eq(members.projectId, projectId), eq(members.userId, userId)),
    });

    if (!currentUserMember) {
      return {
        data: null,
        error: {
          type: "UNAUTHORIZED",
          message: "User is not a member of this project",
        },
      };
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return {
        data: null,
        error: {
          type: "NOT_FOUND",
          message: "Project not found",
        },
      };
    }

    const tasks = await db.query.tasks.findMany({
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

    return {
      data: tasks,
    };
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    return {
      data: null,
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch project tasks",
      },
    };
  }
};

type TaskResponse = {
  data: ProjectTask | null;
  error?: TasksError;
};

export const getTask = async (
  projectId: string,
  taskId: string
): Promise<TaskResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        data: null,
        error: {
          type: "UNAUTHORIZED",
          message: "No active session found",
        },
      };
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, session.user.id)
      ),
    });

    if (!currentUserMember) {
      return {
        data: null,
        error: {
          type: "UNAUTHORIZED",
          message: "User is not a member of this project",
        },
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
      return {
        data: null,
        error: {
          type: "NOT_FOUND",
          message: "Task not found",
        },
      };
    }

    return {
      data: task,
    };
  } catch (error) {
    console.error("Error fetching task:", error);
    return {
      data: null,
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to fetch task",
      },
    };
  }
};

type CreateTaskResponse = {
  data: { taskId: string } | null;
  error?: TasksError;
};

export const createTask = async (
  projectId: string,
  formValues: TaskFormValues
): Promise<CreateTaskResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        data: null,
        error: {
          type: "UNAUTHORIZED",
          message: "No active session found",
        },
      };
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return {
        data: null,
        error: {
          type: "NOT_FOUND",
          message: "Project not found",
        },
      };
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, session.user.id)
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      return {
        data: null,
        error: {
          type: "UNAUTHORIZED",
          message: "Only project owners or admins can create tasks",
        },
      };
    }

    const taskResult = await db
      .insert(tasks)
      .values({
        name: formValues.name,
        label: formValues.label,
        priority: formValues.priority,
        dueDate: formValues.dueDate,
        description: formValues.description,
        status: "TO_DO",
        memberId: formValues.memberId,
        projectId: projectId,
      })
      .returning({ id: tasks.id });

    if (taskResult.length === 0) {
      return {
        data: null,
        error: {
          type: "DATABASE_ERROR",
          message: "Failed to create task",
        },
      };
    }

    return {
      data: { taskId: taskResult[0].id },
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      data: null,
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to create task",
      },
    };
  }
};
