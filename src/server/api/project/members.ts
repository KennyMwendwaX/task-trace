"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import { members, membershipRequests, projects } from "@/database/schema";
import { Member } from "@/lib/schema/MemberSchema";
import { ProjectMembershipRequest } from "@/lib/schema/MembershipRequests";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type MemberError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "FORBIDDEN"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

type MembersResponse = {
  data: Member[] | null;
  error?: MemberError;
};

export const getProjectMembers = async (
  projectId: string,
  userId?: string
): Promise<MembersResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
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
      },
    });

    return {
      data: projectMembers,
    };
  } catch (error) {
    console.error("Error fetching project members:", error);
    return {
      data: null,
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch project members",
      },
    };
  }
};

type MembershipResponse = {
  data: ProjectMembershipRequest[] | null;
  error?: MemberError;
};

export const getMembershipRequests = async (
  projectId: string,
  userId?: string
): Promise<MembershipResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
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

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      return {
        data: null,
        error: {
          type: "UNAUTHORIZED",
          message:
            "Only project owners or admins can generate invitation codes",
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

    const requests = await db.query.membershipRequests.findMany({
      where: eq(membershipRequests.projectId, projectId),
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
    });

    return {
      data: requests,
    };
  } catch (error) {
    console.error("Error fetching project membership request:", error);
    return {
      data: null,
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch project membership requests",
      },
    };
  }
};

type LeaveProjectResponse = {
  success?: boolean;
  error?: {
    type: string;
    message: string;
  };
};

export const leaveProject = async (
  projectId: string
): Promise<LeaveProjectResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return {
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
        error: {
          type: "NOT_FOUND",
          message: "You are not a member of this project",
        },
      };
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return {
        error: {
          type: "NOT_FOUND",
          message: "Project not found",
        },
      };
    }

    if (project.ownerId === session.user.id) {
      return {
        error: {
          type: "FORBIDDEN",
          message: "Project owner cannot leave. Transfer ownership first.",
        },
      };
    }

    await db
      .delete(members)
      .where(
        and(
          eq(members.projectId, projectId),
          eq(members.userId, session.user.id)
        )
      );

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error leaving project:", error);
    return {
      error: {
        type: "DATABASE_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to leave project",
      },
    };
  }
};
