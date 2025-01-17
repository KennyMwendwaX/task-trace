"use server";

import { auth } from "@/auth";
import db from "@/database/db";
import { members, membershipRequests, projects } from "@/database/schema";
import { ProjectMembershipRequest } from "@/lib/schema/MembershipRequests";
import { and, eq } from "drizzle-orm";

export const getMembershipRequests = async (
  projectId: string,
  userId?: string
): Promise<{ data: ProjectMembershipRequest[] | null; error?: string }> => {
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

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      return {
        data: null,
        error: "You don't have permission get the project membership requests",
      };
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return { data: null, error: "Project not found" };
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
      error: "Failed to fetch project membership request",
    };
  }
};
