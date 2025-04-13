"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import {
  DetailedProject,
  members,
  projects,
  PublicProject,
} from "@/database/schema";
import { ProjectFormValues } from "@/lib/schema/ProjectSchema";
import { and, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ProjectActionError } from "@/lib/errors";

export const getProject = async (
  projectId: string,
  userId?: string
): Promise<DetailedProject> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getProject"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getProject"
      );
    }

    // Check if project exists FIRST
    const projectData = await db.query.projects.findFirst({
      where: eq(projects.id, parseInt(projectId)),
      with: {
        owner: {
          columns: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!projectData) {
      throw new ProjectActionError(
        "NOT_FOUND",
        "Project not found",
        "getProject"
      );
    }

    // Then check membership
    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, parseInt(projectId)),
        eq(members.userId, parseInt(userId))
      ),
    });

    if (!currentUserMember) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "User is not a member of the project",
        "getProject"
      );
    }

    const project: DetailedProject = {
      ...projectData,
      member: {
        id: currentUserMember.id,
        role: currentUserMember.role,
        createdAt: currentUserMember.createdAt,
        updatedAt: currentUserMember.updatedAt,
        userId: currentUserMember.userId,
        projectId: currentUserMember.projectId,
      },
    };

    return project;
  } catch (error) {
    console.error("Error in getProject:", error);
    if (error instanceof ProjectActionError) {
      throw error;
    }
    throw new ProjectActionError(
      "DATABASE_ERROR",
      "Failed to fetch project",
      "getProject"
    );
  }
};

export async function getProjects(userId?: string): Promise<PublicProject[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getProjects"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getProjects"
      );
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
      throw new ProjectActionError(
        "NOT_FOUND",
        "No projects found",
        "getProjects"
      );
    }

    if (projectsResult.length === 0) {
      return [];
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

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    if (error instanceof ProjectActionError) {
      throw error;
    }
    throw new ProjectActionError(
      "DATABASE_ERROR",
      "Failed to fetch projects",
      "getProjects"
    );
  }
}

export const updateProject = async (
  projectId: number,
  formValues: ProjectFormValues,
  userId?: string
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "No active session found",
        "updateProject"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "updateProject"
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      throw new ProjectActionError(
        "NOT_FOUND",
        "Project not found",
        "updateProject"
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
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "Only project owners or admins can update project details.",
        "updateProject"
      );
    }

    const updatedProject = await db
      .update(projects)
      .set({
        name: formValues.name,
        status: formValues.status,
        description: formValues.description,
      })
      .where(eq(projects.id, projectId))
      .returning();

    if (updatedProject.length === 0) {
      throw new ProjectActionError(
        "DATABASE_ERROR",
        "Failed to update project",
        "updateProject"
      );
    }

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating project:", error);
    if (error instanceof ProjectActionError) {
      throw error;
    }
    throw new ProjectActionError(
      "DATABASE_ERROR",
      "Failed to update project",
      "updateProject"
    );
  }
};

export const deleteProject = async (
  projectId: number
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "No active session found",
        "deleteProject"
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      throw new ProjectActionError(
        "NOT_FOUND",
        "Project not found",
        "deleteProject"
      );
    }

    if (project.ownerId !== parseInt(session.user.id)) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "Only the project owner can delete the project",
        "deleteProject"
      );
    }

    await db.delete(projects).where(eq(projects.id, projectId));

    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    if (error instanceof ProjectActionError) {
      throw error;
    }
    throw new ProjectActionError(
      "DATABASE_ERROR",
      "Failed to delete project",
      "deleteProject"
    );
  }
};

export const toggleProjectVisibility = async (
  projectId: number,
  isPublic: boolean
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "No active session found",
        "toggleProjectVisibility"
      );
    }

    const userMembership = await db.query.members.findFirst({
      where: and(
        eq(members.userId, parseInt(session.user.id)),
        eq(members.projectId, projectId),
        or(eq(members.role, "OWNER"), eq(members.role, "ADMIN"))
      ),
    });

    if (!userMembership) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "Only project owners or admins can update project visibility.",
        "toggleProjectVisibility"
      );
    }

    const updatedProject = await db
      .update(projects)
      .set({ isPublic })
      .where(eq(projects.id, projectId))
      .returning();

    if (updatedProject.length === 0) {
      throw new ProjectActionError(
        "DATABASE_ERROR",
        "Failed to update project visibility",
        "toggleProjectVisibility"
      );
    }

    revalidatePath(`/projects/${projectId}/settings`);
    return { success: true };
  } catch (error) {
    console.error("Error updating project visibility:", error);
    if (error instanceof ProjectActionError) {
      throw error;
    }
    throw new ProjectActionError(
      "DATABASE_ERROR",
      "Failed to update project visibility",
      "toggleProjectVisibility"
    );
  }
};
