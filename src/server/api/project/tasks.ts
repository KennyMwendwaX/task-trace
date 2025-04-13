"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import { members, projects, ProjectTask, tasks } from "@/database/schema";
import { Label, Priority, Status } from "@/lib/config";
import { TaskFormValues } from "@/lib/schema/TaskSchema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { TasksActionError } from "@/lib/errors";

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
      throw new TasksActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getProjectTasks"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getProjectTasks"
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, parseInt(projectId)),
    });

    if (!project) {
      throw new TasksActionError(
        "NOT_FOUND",
        "Project not found",
        "getProjectTasks"
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, parseInt(projectId)),
        eq(members.userId, parseInt(userId))
      ),
    });

    if (!currentUserMember) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "User is not a member of the project",
        "getProjectTasks"
      );
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
    throw new TasksActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to fetch tasks",
      "getProjectTasks"
    );
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
      throw new TasksActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getProjectTask"
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, parseInt(projectId)),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (!currentUserMember) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "User is not a member of the project",
        "getProjectTask"
      );
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
      throw new TasksActionError(
        "NOT_FOUND",
        "Task not found",
        "getProjectTask"
      );
    }

    return task;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw new TasksActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to fetch task",
      "getProjectTask"
    );
  }
};

export const createTask = async (
  projectId: number,
  formValues: TaskFormValues
): Promise<{ taskId: number }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "No active session found",
        "createTask"
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      throw new TasksActionError(
        "NOT_FOUND",
        "Project not found",
        "createTask"
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "Only project owners or admins can create tasks",
        "createTask"
      );
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
        memberId: formValues.memberId ? parseInt(formValues.memberId) : null,
        projectId: projectId,
      })
      .returning({ id: tasks.id });

    if (taskResult.length === 0) {
      throw new TasksActionError(
        "DATABASE_ERROR",
        "Failed to create task",
        "createTask"
      );
    }

    return { taskId: taskResult[0].id };
  } catch (error) {
    console.error("Error creating task:", error);
    throw new TasksActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to create task",
      "createTask"
    );
  }
};

export const updateTask = async (
  projectId: number,
  taskId: number,
  formValues: TaskFormValues
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "No active session found",
        "updateTask"
      );
    }

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      throw new TasksActionError("NOT_FOUND", "Task not found", "updateTask");
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "Only project owners or admins can modify this task",
        "updateTask"
      );
    }

    const taskResult = await db
      .update(tasks)
      .set({
        name: formValues.name,
        label: formValues.label,
        status: formValues.status,
        priority: formValues.priority,
        dueDate: formValues.dueDate,
        memberId: formValues.memberId ? parseInt(formValues.memberId) : null,
        description: formValues.description,
      })
      .where(eq(tasks.id, taskId))
      .returning();

    if (taskResult.length === 0) {
      throw new TasksActionError(
        "DATABASE_ERROR",
        "Failed to update task",
        "updateTask"
      );
    }

    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating task:", error);
    throw new TasksActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to update task",
      "updateTask"
    );
  }
};

export const updateTaskLabel = async (
  projectId: number,
  taskId: number,
  label: Label
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "No active session found",
        "updateTaskLabel"
      );
    }

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      throw new TasksActionError(
        "NOT_FOUND",
        "Task not found",
        "updateTaskLabel"
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "Only project owners or admins can modify this task label",
        "updateTaskLabel"
      );
    }

    const taskResult = await db
      .update(tasks)
      .set({
        label: label,
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)))
      .returning();

    if (taskResult.length === 0) {
      throw new TasksActionError(
        "DATABASE_ERROR",
        "Failed to update task label",
        "updateTaskLabel"
      );
    }

    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating task label:", error);
    throw new TasksActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to update task label",
      "updateTaskLabel"
    );
  }
};

export const updateTaskStatus = async (
  projectId: number,
  taskId: number,
  status: Status
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "No active session found",
        "updateTaskStatus"
      );
    }

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      throw new TasksActionError(
        "NOT_FOUND",
        "Task not found",
        "updateTaskStatus"
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "Only project owners or admins can modify this task status",
        "updateTaskStatus"
      );
    }

    const taskResult = await db
      .update(tasks)
      .set({
        status: status,
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)))
      .returning();

    if (taskResult.length === 0) {
      throw new TasksActionError(
        "DATABASE_ERROR",
        "Failed to update task status",
        "updateTaskStatus"
      );
    }

    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating task status:", error);
    throw new TasksActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to update task status",
      "updateTaskStatus"
    );
  }
};

export const updateTaskPriority = async (
  projectId: number,
  taskId: number,
  priority: Priority
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "No active session found",
        "updateTaskPriority"
      );
    }

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      throw new TasksActionError(
        "NOT_FOUND",
        "Task not found",
        "updateTaskPriority"
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "Only project owners or admins can modify this task priority",
        "updateTaskPriority"
      );
    }

    const taskResult = await db
      .update(tasks)
      .set({
        priority: priority,
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)))
      .returning();

    if (taskResult.length === 0) {
      throw new TasksActionError(
        "DATABASE_ERROR",
        "Failed to update task priority",
        "updateTaskPriority"
      );
    }

    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating task priority:", error);
    throw new TasksActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to update task priority",
      "updateTaskPriority"
    );
  }
};

export const deleteTask = async (
  projectId: number,
  taskId: number
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "No active session found",
        "deleteTask"
      );
    }

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task) {
      throw new TasksActionError("NOT_FOUND", "Task not found", "deleteTask");
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      throw new TasksActionError(
        "UNAUTHORIZED",
        "Only project owners and admins can delete tasks",
        "deleteTask"
      );
    }

    await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new TasksActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to delete task",
      "deleteTask"
    );
  }
};
