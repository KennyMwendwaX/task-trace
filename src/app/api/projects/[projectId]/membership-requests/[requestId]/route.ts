import { auth } from "@/auth";
import db from "@/database/db";
import {
  members,
  membershipRequests,
  projects,
  users,
} from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const POST = auth(async (req) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const segments = req.nextUrl.pathname.split("/");
    const projectId = segments[segments.length - 3];
    const requestId = segments[segments.length - 1];

    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    const requestBody = await req.json();

    const { userId } = requestBody;

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, req.auth.user.id)
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      return NextResponse.json(
        { message: "You don't have permission to add members to this project" },
        { status: 403 }
      );
    }

    const targetUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const existingMember = await db.query.members.findFirst({
      where: and(eq(members.projectId, projectId), eq(members.userId, userId)),
    });

    if (existingMember) {
      return NextResponse.json(
        { message: "User is already a member of this project" },
        { status: 409 }
      );
    }

    await db
      .update(membershipRequests)
      .set({ status: "APPROVED" })
      .where(
        and(
          eq(membershipRequests.id, requestId),
          eq(membershipRequests.projectId, projectId)
        )
      );

    await db.insert(members).values({
      role: "MEMBER",
      userId,
      projectId,
    });

    return NextResponse.json(
      { message: "Member added to project successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding member to project:", error);
    return NextResponse.json(
      { message: "Server error, please try again later" },
      { status: 500 }
    );
  }
});

export const PUT = auth(async (req) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const segments = req.nextUrl.pathname.split("/");
    const projectId = segments[segments.length - 3];
    const requestId = segments[segments.length - 1];

    if (!projectId || !requestId) {
      return NextResponse.json(
        { message: "Project ID and Member ID are required" },
        { status: 400 }
      );
    }

    const requestBody = await req.json();
    const { status } = requestBody;

    if (!status || !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status provided" },
        { status: 400 }
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, req.auth.user.id)
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      return NextResponse.json(
        { message: "You don't have permission to approve membership requests" },
        { status: 403 }
      );
    }

    await db
      .update(membershipRequests)
      .set({ status })
      .where(
        and(
          eq(membershipRequests.id, requestId),
          eq(membershipRequests.projectId, projectId)
        )
      );

    return NextResponse.json(
      { message: "Member request status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating membership request status:", error);
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
});
