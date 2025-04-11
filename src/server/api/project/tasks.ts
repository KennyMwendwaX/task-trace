"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import { members, projects, ProjectTask, tasks } from "@/database/schema";
import { Label, Priority, Status } from "@/lib/config";
import { TaskFormValues } from "@/lib/schema/TaskSchema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type TasksError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

export const getProjectTasks = async (
  projectId: string,
  userId?: string
): Promise<ProjectTask[]> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("No active session found");
    }

    if (!userId || userId !== session.user.id) {
      throw new Error("User ID mismatch or missing");
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, parseInt(projectId)),
        eq(members.userId, parseInt(userId))
      ),
    });

    if (!currentUserMember) {
      throw new Error("User is not a member of the project");
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, parseInt(projectId)),
    });

    if (!project) {
      throw new Error("Project not found");
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
                image: true,
              },
            },
          },
        },
      },
    });

    return tasks;
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    throw new Error("Error fetching project tasks");
  }
};

export const getProjectTask = async (
  projectId: string,
  taskId: string
): Promise<ProjectTask> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("No active session found");
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, parseInt(projectId)),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (!currentUserMember) {
      throw new Error("User is not a member of the project");
    }

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, parseInt(taskId)),
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
                image: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw new Error("Failed to fetch task");
  }
};

type CreateTaskResponse = {
  data: { taskId: string } | null;
  error?: TasksError;
};

export const createTask = async (
  projectId: number,
  formValues: TaskFormValues
): Promise<CreateTaskResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
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
        status: formValues.status,
        priority: formValues.priority,
        dueDate: formValues.dueDate,
        description: formValues.description,
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

type UpdateTaskResponse = {
  success: boolean;
  error?: TasksError;
};

export const updateTask = async (
  projectId: number,
  taskId: number,
  formValues: TaskFormValues
): Promise<UpdateTaskResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return {
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "No active session found",
        },
      };
    }

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      return {
        success: false,
        error: {
          type: "NOT_FOUND",
          message: "Task not found",
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
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "Only project owners or admins can create tasks",
        },
      };
    }

    const taskResult = await db
      .update(tasks)
      .set({
        name: formValues.name,
        label: formValues.label,
        status: formValues.status,
        priority: formValues.priority,
        dueDate: formValues.dueDate,
        memberId: formValues.memberId,
        description: formValues.description,
      })
      .where(eq(tasks.id, taskId))
      .returning();

    if (taskResult.length === 0) {
      return {
        success: false,
        error: {
          type: "DATABASE_ERROR",
          message: "Failed to update task",
        },
      };
    }

    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating task:", error);
    return {
      success: false,
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to update task",
      },
    };
  }
};

export const updateTaskLabel = async (
  projectId: number,
  taskId: number,
  label: Label
): Promise<UpdateTaskResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return {
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "No active session found",
        },
      };
    }

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      return {
        success: false,
        error: {
          type: "NOT_FOUND",
          message: "Task not found",
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
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "Only project owners or admins modify this task",
        },
      };
    }

    const taskResult = await db
      .update(tasks)
      .set({
        label: label,
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)))
      .returning();

    if (taskResult.length === 0) {
      return {
        success: false,
        error: {
          type: "DATABASE_ERROR",
          message: "Failed to update task label",
        },
      };
    }

    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating task label:", error);
    return {
      success: false,
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update task label",
      },
    };
  }
};

export const updateTaskStatus = async (
  projectId: number,
  taskId: number,
  status: Status
): Promise<UpdateTaskResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return {
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "No active session found",
        },
      };
    }

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      return {
        success: false,
        error: {
          type: "NOT_FOUND",
          message: "Task not found",
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
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "Only project owners or admins modify this task",
        },
      };
    }

    const taskResult = await db
      .update(tasks)
      .set({
        status: status,
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)))
      .returning();

    if (taskResult.length === 0) {
      return {
        success: false,
        error: {
          type: "DATABASE_ERROR",
          message: "Failed to update task status",
        },
      };
    }

    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating task status:", error);
    return {
      success: false,
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update task status",
      },
    };
  }
};

export const updateTaskPriority = async (
  projectId: number,
  taskId: number,
  priority: Priority
): Promise<UpdateTaskResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return {
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "No active session found",
        },
      };
    }

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      return {
        success: false,
        error: {
          type: "NOT_FOUND",
          message: "Task not found",
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
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "Only project owners or admins modify this task",
        },
      };
    }

    const taskResult = await db
      .update(tasks)
      .set({
        priority: priority,
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)))
      .returning();

    if (taskResult.length === 0) {
      return {
        success: false,
        error: {
          type: "DATABASE_ERROR",
          message: "Failed to update task priority",
        },
      };
    }

    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating task priority:", error);
    return {
      success: false,
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update task priority",
      },
    };
  }
};

type DeleteTaskResponse = {
  success: boolean;
  error?: {
    type: string;
    message: string;
  };
};

export const deleteTask = async (
  projectId: number,
  taskId: number
): Promise<DeleteTaskResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return {
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "No active session found",
        },
      };
    }

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      return {
        success: false,
        error: {
          type: "NOT_FOUND",
          message: "Task not found",
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
        success: false,
        error: {
          type: "UNAUTHORIZED",
          message: "Only project owners or admins can delete tasks",
        },
      };
    }

    await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting task:", error);
    return {
      success: false,
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to delete task",
      },
    };
  }
};
