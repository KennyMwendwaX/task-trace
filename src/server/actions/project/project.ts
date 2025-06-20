"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/server/database";
import {
  DetailedProject,
  members,
  membershipRequests,
  projectBookmarks,
  projects,
  PublicProject,
} from "@/server/database/schema";
import { ProjectFormValues } from "@/lib/schema/ProjectSchema";
import { and, eq, inArray, or } from "drizzle-orm";
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
        eq(members.userId, parseInt(session.user.id))
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
      error instanceof Error ? error.message : "Failed to fetch project",
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

    // Get projects with tasks and members
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
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });

    if (!projectsResult) {
      throw new ProjectActionError(
        "NOT_FOUND",
        "No projects found",
        "getProjects"
      );
    }

    if (projectsResult.length === 0) {
      return [];
    }

    // Get bookmarked project IDs for the current user
    const projectIds = projectsResult.map((p) => p.id);
    const bookmarkedProjects = await db.query.projectBookmarks.findMany({
      where: and(
        eq(projectBookmarks.userId, parseInt(userId)),
        inArray(projectBookmarks.projectId, projectIds)
      ),
      columns: {
        projectId: true,
      },
    });

    // Create a Set for O(1) lookup
    const bookmarkedProjectIds = new Set(
      bookmarkedProjects.map((bookmark) => bookmark.projectId)
    );

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
        isBookmarked: bookmarkedProjectIds.has(project.id),
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
      error instanceof Error ? error.message : "Failed to fetch projects",
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
      error instanceof Error ? error.message : "Failed to update project",
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
      error instanceof Error ? error.message : "Failed to delete project",
      "deleteProject"
    );
  }
};

type ProjectAccessInfo = {
  isMember: boolean;
  isPublic: boolean;
  hasPendingRequest: boolean;
  projectName: string;
};

export const checkProjectAccess = async (
  projectId: string,
  userId: string
): Promise<ProjectAccessInfo> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "No active session found",
        "checkProjectAccess"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "checkProjectAccess"
      );
    }

    // Check if project exists
    const projectData = await db.query.projects.findFirst({
      where: eq(projects.id, parseInt(projectId)),
    });

    if (!projectData) {
      throw new ProjectActionError(
        "NOT_FOUND",
        "Project not found",
        "checkProjectAccess"
      );
    }

    // Check membership
    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, parseInt(projectId)),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    // Check pending membership request
    const pendingRequest = await db.query.membershipRequests.findFirst({
      where: and(
        eq(membershipRequests.projectId, parseInt(projectId)),
        eq(membershipRequests.requesterId, parseInt(session.user.id)),
        eq(membershipRequests.status, "PENDING")
      ),
    });

    return {
      isMember: !!currentUserMember,
      isPublic: projectData.isPublic,
      hasPendingRequest: !!pendingRequest,
      projectName: projectData.name,
    };
  } catch (error) {
    console.error("Error in checkProjectAccess:", error);
    if (error instanceof ProjectActionError) {
      throw error;
    }
    throw new ProjectActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to check project access",
      "checkProjectAccess"
    );
  }
};

export const joinPublicProject = async (
  projectId: string
): Promise<{ success: boolean }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "No active session found",
        "joinPublicProject"
      );
    }

    // Check if project exists and is public
    const projectData = await db.query.projects.findFirst({
      where: eq(projects.id, parseInt(projectId)),
    });

    if (!projectData) {
      throw new ProjectActionError(
        "NOT_FOUND",
        "Project not found",
        "joinPublicProject"
      );
    }

    if (!projectData.isPublic) {
      throw new ProjectActionError(
        "UNAUTHORIZED",
        "This project is not public",
        "joinPublicProject"
      );
    }

    // Check if user is already a member
    const existingMembership = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, parseInt(projectId)),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (existingMembership) {
      return { success: true };
    }

    // Add user as a member
    await db.insert(members).values({
      projectId: parseInt(projectId),
      userId: parseInt(session.user.id),
      role: "MEMBER",
    });

    return { success: true };
  } catch (error) {
    console.error("Error in joinPublicProject:", error);
    if (error instanceof ProjectActionError) {
      throw error;
    }
    throw new ProjectActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to join public project",
      "joinPublicProject"
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
      error instanceof Error
        ? error.message
        : "Failed to update project visibility",
      "toggleProjectVisibility"
    );
  }
};
