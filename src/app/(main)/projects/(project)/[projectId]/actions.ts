"use server";

import { auth } from "@/auth";
import db from "@/database/db";
import { invitationCodes, members, projects } from "@/database/schema";
import { DetailedProject } from "@/lib/schema/ProjectSchema";
import { ProjectTask } from "@/lib/schema/TaskSchema";
import { add } from "date-fns";
import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

export const getProject = async (
  projectId: string,
  userId?: string
): Promise<{ data: DetailedProject | null; error?: string }> => {
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

    const projectData = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
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
      return {
        data: null,
      };
    }

    const project = {
      ...projectData,
      member: currentUserMember
        ? {
            id: currentUserMember.id,
            role: currentUserMember.role,
          }
        : null,
    };

    return {
      data: project,
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    return {
      data: null,
      error: "Failed to fetch project",
    };
  }
};

export const getProjectMembers = async (projectId: string, userId?: string) => {
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

    const currentUserMember = await db.query.members.findFirst({
      where: and(eq(members.projectId, projectId), eq(members.userId, userId)),
    });

    if (!currentUserMember) {
      return {
        error: "You are not a member of the project",
      };
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return {
        data: { error: "Project not found" },
      };
    }

    const projectMembers = await db.query.members.findMany({
      where: eq(members.projectId, projectId),
      with: {
        user: {
          columns: {
            name: true,
            email: true,
            image: true,
          },
        },
        tasks: true,
      },
    });

    return {
      data: projectMembers,
    };
  } catch (error) {
    console.error("Error fetching project members:", error);
    return {
      error: "Failed to fetch project members",
    };
  }
};

export const getProjectTasks = async (
  projectId: string,
  userId?: string
): Promise<{ data: ProjectTask[] | null; error?: string }> => {
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

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return { data: null, error: "Project not found" };
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
      error: "Failed to fetch project tasks",
    };
  }
};

export const getProjectInvitationCode = async (
  projectId: string,
  userId?: string
) => {
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

    const currentUserMember = await db.query.members.findFirst({
      where: and(eq(members.projectId, projectId), eq(members.userId, userId)),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      return {
        error: "You don't have permission get the project invitation code",
      };
    }

    const nanoidCustom = customAlphabet("0123456789", 8);
    const code = nanoidCustom();
    const expiresAt = add(new Date(), { days: 7 });

    const existingCode = await db.query.invitationCodes.findFirst({
      where: eq(invitationCodes.projectId, projectId),
    });

    if (!existingCode) {
      await db.insert(invitationCodes).values({ code, projectId, expiresAt });
      return { data: { code, expiresAt } };
    }

    const updatedCode = await db
      .update(invitationCodes)
      .set({ code, expiresAt })
      .where(eq(invitationCodes.projectId, projectId))
      .returning();

    return {
      data: { code: updatedCode[0].code, expiresAt: updatedCode[0].expiresAt },
    };
  } catch (error) {
    console.error("Error fetching project invitation code:", error);
    return {
      error: "Failed to fetch project invitation code",
    };
  }
};
