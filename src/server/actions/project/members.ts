"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/server/database";
import {
  members,
  membershipRequests,
  projects,
  ProjectMember,
  ProjectMembershipRequest,
} from "@/server/database/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { MemberActionError } from "@/lib/errors";
import { MembershipRequestStatus, ProjectRole } from "@/lib/config";

export const getProjectMembers = async (
  projectId: string,
  userId?: string
): Promise<ProjectMember[]> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getProjectMembers"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getProjectMembers"
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, parseInt(projectId)),
    });

    if (!project) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Project not found",
        "getProjectMembers"
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, parseInt(projectId)),
        eq(members.userId, parseInt(userId))
      ),
    });

    if (!currentUserMember) {
      throw new MemberActionError(
        "NOT_FOUND",
        "You are not a member of this project",
        "getProjectMembers"
      );
    }

    const projectMembers = await db.query.members.findMany({
      where: eq(members.projectId, parseInt(projectId)),
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

    return projectMembers;
  } catch (error) {
    console.error("Error fetching project members:", error);
    if (error instanceof MemberActionError) {
      throw error;
    }
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error
        ? error.message
        : "Failed to fetch project members",
      "getProjectMembers"
    );
  }
};

export const getCurrentUserRole = async (
  projectId: string
): Promise<ProjectRole> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getCurrentUserRole"
      );
    }

    const userId = session.user.id;

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, parseInt(projectId)),
    });

    if (!project) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Project not found",
        "getCurrentUserRole"
      );
    }

    // Check if the user is the project owner for quick role determination
    if (project.ownerId === parseInt(userId)) {
      return "OWNER";
    }

    // Otherwise, query the members table to get the user's role
    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, parseInt(projectId)),
        eq(members.userId, parseInt(userId))
      ),
    });

    if (!currentUserMember) {
      throw new MemberActionError(
        "NOT_FOUND",
        "You are not a member of this project",
        "getCurrentUserRole"
      );
    }

    return currentUserMember.role;
  } catch (error) {
    console.error("Error fetching user role:", error);
    if (error instanceof MemberActionError) {
      throw error;
    }
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to fetch user role",
      "getCurrentUserRole"
    );
  }
};

export const updateProjectMemberRole = async (
  projectId: number,
  memberId: number,
  newRole: ProjectRole
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "changeMemberRole"
      );
    }

    const userId = session.user.id;

    // Check if the project exists
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Project not found",
        "changeMemberRole"
      );
    }

    // Check if the current user is a member of the project
    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, parseInt(userId))
      ),
    });

    if (!currentUserMember) {
      throw new MemberActionError(
        "NOT_FOUND",
        "You are not a member of this project",
        "changeMemberRole"
      );
    }

    // Check if the current user has permission to change roles
    if (
      currentUserMember.role !== "OWNER" &&
      !(currentUserMember.role === "ADMIN" && newRole !== "OWNER")
    ) {
      throw new MemberActionError(
        "FORBIDDEN",
        "You don't have permission to change member roles",
        "changeMemberRole"
      );
    }

    // Check if the member exists
    const memberToUpdate = await db.query.members.findFirst({
      where: and(eq(members.id, memberId), eq(members.projectId, projectId)),
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

    if (!memberToUpdate) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Member not found in this project",
        "changeMemberRole"
      );
    }

    // Admin cannot change Owner's role
    if (currentUserMember.role === "ADMIN" && memberToUpdate.role === "OWNER") {
      throw new MemberActionError(
        "FORBIDDEN",
        "Admins cannot change the Owner's role",
        "changeMemberRole"
      );
    }

    // Update the member's role
    await db
      .update(members)
      .set({
        role: newRole,
        updatedAt: new Date(),
      })
      .where(and(eq(members.id, memberId), eq(members.projectId, projectId)));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error changing member role:", error);
    if (error instanceof MemberActionError) {
      throw error;
    }
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to change member role",
      "changeMemberRole"
    );
  }
};

export const removeMember = async (
  projectId: number,
  memberId: number
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "removeMember"
      );
    }

    const userId = session.user.id;

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Project not found",
        "removeMember"
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, parseInt(userId))
      ),
    });

    if (!currentUserMember) {
      throw new MemberActionError(
        "NOT_FOUND",
        "You are not a member of this project",
        "removeMember"
      );
    }

    const memberToRemove = await db.query.members.findFirst({
      where: and(eq(members.id, memberId), eq(members.projectId, projectId)),
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!memberToRemove) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Member not found in this project",
        "removeMember"
      );
    }

    // Check if the current user has permission to remove members
    // OWNER can remove anyone, ADMIN can remove MEMBER but not another ADMIN or OWNER
    const hasPermission =
      currentUserMember.role === "OWNER" ||
      (currentUserMember.role === "ADMIN" && memberToRemove.role === "MEMBER");

    if (!hasPermission) {
      throw new MemberActionError(
        "FORBIDDEN",
        "You don't have permission to remove this member",
        "removeMember"
      );
    }

    // Cannot remove project owner
    if (memberToRemove.role === "OWNER") {
      throw new MemberActionError(
        "FORBIDDEN",
        "The project owner cannot be removed",
        "removeMember"
      );
    }

    // Cannot remove yourself (use leave project instead)
    if (memberToRemove.userId === parseInt(userId)) {
      throw new MemberActionError(
        "FORBIDDEN",
        "You cannot remove yourself from the project. Use leave project instead.",
        "removeMember"
      );
    }

    // Remove the member
    await db
      .delete(members)
      .where(and(eq(members.id, memberId), eq(members.projectId, projectId)));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error removing member:", error);
    if (error instanceof MemberActionError) {
      throw error;
    }
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to remove member",
      "removeMember"
    );
  }
};

export const createMembershipRequest = async (
  projectId: string | number
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "createMembershipRequest"
      );
    }

    const numericProjectId =
      typeof projectId === "string" ? parseInt(projectId) : projectId;

    // Check if project exists
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, numericProjectId),
    });

    if (!project) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Project not found",
        "createMembershipRequest"
      );
    }

    // Check if user is already a member of the project
    const existingMembership = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, numericProjectId),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (existingMembership) {
      throw new MemberActionError(
        "FORBIDDEN",
        "You are already a member of this project",
        "createMembershipRequest"
      );
    }

    // Check if user already has a pending request
    const existingRequest = await db.query.membershipRequests.findFirst({
      where: and(
        eq(membershipRequests.projectId, numericProjectId),
        eq(membershipRequests.requesterId, parseInt(session.user.id))
      ),
    });

    if (existingRequest) {
      throw new MemberActionError(
        "FORBIDDEN",
        "You already have a pending request for this project",
        "createMembershipRequest"
      );
    }

    // Create new membership request
    const result = await db
      .insert(membershipRequests)
      .values({
        projectId: numericProjectId,
        requesterId: parseInt(session.user.id),
        status: "PENDING",
      })
      .returning({ id: membershipRequests.id });

    if (result.length === 0) {
      throw new MemberActionError(
        "DATABASE_ERROR",
        "Failed to create membership request",
        "createMembershipRequest"
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error creating membership request:", error);
    if (error instanceof MemberActionError) {
      throw error;
    }
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error
        ? error.message
        : "Failed to create membership request",
      "createMembershipRequest"
    );
  }
};

export const getMembershipRequests = async (
  projectId: string,
  userId?: string
): Promise<ProjectMembershipRequest[]> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getMembershipRequests"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getMembershipRequests"
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, parseInt(projectId)),
    });

    if (!project) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Project not found",
        "getMembershipRequests"
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, parseInt(projectId)),
        eq(members.userId, parseInt(userId))
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      throw new MemberActionError(
        "FORBIDDEN",
        "Only project owners or admins can view membership requests",
        "getMembershipRequests"
      );
    }

    const requests = await db.query.membershipRequests.findMany({
      where: eq(membershipRequests.projectId, parseInt(projectId)),
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

    return requests;
  } catch (error) {
    console.error("Error fetching project membership request:", error);
    if (error instanceof MemberActionError) {
      throw error;
    }
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error
        ? error.message
        : "Failed to fetch project membership requests",
      "getMembershipRequests"
    );
  }
};

export const acceptMembershipRequest = async (
  requestId: string | number
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "acceptMembershipRequest"
      );
    }

    const numericRequestId =
      typeof requestId === "string" ? parseInt(requestId) : requestId;

    // Fetch the membership request
    const request = await db.query.membershipRequests.findFirst({
      where: eq(membershipRequests.id, numericRequestId),
      with: {
        project: true,
      },
    });

    if (!request) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Membership request not found",
        "acceptMembershipRequest"
      );
    }

    // Check if the user is the project owner or has admin rights
    const userMembership = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, request.projectId),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (
      !userMembership ||
      (userMembership.role !== "OWNER" && userMembership.role !== "ADMIN")
    ) {
      throw new MemberActionError(
        "FORBIDDEN",
        "You don't have permission to accept membership requests",
        "acceptMembershipRequest"
      );
    }

    // Check if request is pending
    if (request.status !== "PENDING") {
      throw new MemberActionError(
        "FORBIDDEN",
        "This request has already been processed",
        "acceptMembershipRequest"
      );
    }

    // Update request status to APPROVED
    await db
      .update(membershipRequests)
      .set({
        status: "APPROVED" as MembershipRequestStatus,
        updatedAt: new Date(),
      })
      .where(eq(membershipRequests.id, numericRequestId));

    // Add user as a member to the project
    await db.insert(members).values({
      userId: request.requesterId,
      projectId: request.projectId,
      role: "MEMBER" as ProjectRole,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error accepting membership request:", error);
    if (error instanceof MemberActionError) {
      throw error;
    }
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error
        ? error.message
        : "Failed to accept membership request",
      "acceptMembershipRequest"
    );
  }
};

export const rejectMembershipRequest = async (
  requestId: string | number
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "rejectMembershipRequest"
      );
    }

    const numericRequestId =
      typeof requestId === "string" ? parseInt(requestId) : requestId;

    // Fetch the membership request
    const request = await db.query.membershipRequests.findFirst({
      where: eq(membershipRequests.id, numericRequestId),
      with: {
        project: true,
      },
    });

    if (!request) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Membership request not found",
        "rejectMembershipRequest"
      );
    }

    // Check if the user is the project owner or has admin rights
    const userMembership = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, request.projectId),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (
      !userMembership ||
      (userMembership.role !== "OWNER" && userMembership.role !== "ADMIN")
    ) {
      throw new MemberActionError(
        "FORBIDDEN",
        "You don't have permission to reject membership requests",
        "rejectMembershipRequest"
      );
    }

    // Check if request is pending
    if (request.status !== "PENDING") {
      throw new MemberActionError(
        "FORBIDDEN",
        "This request has already been processed",
        "rejectMembershipRequest"
      );
    }

    // Update request status to REJECTED
    await db
      .update(membershipRequests)
      .set({
        status: "REJECTED" as MembershipRequestStatus,
        updatedAt: new Date(),
      })
      .where(eq(membershipRequests.id, numericRequestId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error rejecting membership request:", error);
    if (error instanceof MemberActionError) {
      throw error;
    }
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error
        ? error.message
        : "Failed to reject membership request",
      "rejectMembershipRequest"
    );
  }
};

export const leaveProject = async (
  projectId: number
): Promise<{ success: true }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "leaveProject"
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      throw new MemberActionError(
        "NOT_FOUND",
        "Project not found",
        "leaveProject"
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, parseInt(session.user.id))
      ),
    });

    if (!currentUserMember) {
      throw new MemberActionError(
        "NOT_FOUND",
        "You are not a member of this project",
        "leaveProject"
      );
    }

    if (project.ownerId === parseInt(session.user.id)) {
      throw new MemberActionError(
        "FORBIDDEN",
        "Project owners cannot leave the project",
        "leaveProject"
      );
    }

    await db
      .delete(members)
      .where(
        and(
          eq(members.projectId, projectId),
          eq(members.userId, parseInt(session.user.id))
        )
      );

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error leaving project:", error);
    if (error instanceof MemberActionError) {
      throw error;
    }
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error ? error.message : "Failed to leave project",
      "leaveProject"
    );
  }
};
