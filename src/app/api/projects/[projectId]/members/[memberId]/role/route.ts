import { auth } from "@/auth";
import db from "@/database/db";
import { members, projects } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const PATCH = auth(async (req) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const segments = req.nextUrl.pathname.split("/");
    const projectId = segments[segments.length - 4];
    const memberId = segments[segments.length - 2];

    if (!projectId || !memberId) {
      return NextResponse.json(
        { message: "Project ID and Member ID are required" },
        { status: 400 }
      );
    }

    const requestBody = await req.json();
    const { role } = requestBody;

    if (!role || !["OWNER", "ADMIN", "MEMBER"].includes(role)) {
      return NextResponse.json(
        { message: "Invalid role provided" },
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
        { message: "You don't have permission to change member roles" },
        { status: 403 }
      );
    }

    const targetMember = await db.query.members.findFirst({
      where: and(eq(members.id, memberId), eq(members.projectId, projectId)),
    });

    if (!targetMember) {
      return NextResponse.json(
        { message: "Member not found in this project" },
        { status: 404 }
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (project.ownerId === targetMember.userId) {
      return NextResponse.json(
        { message: "Cannot change the role of the project owner" },
        { status: 403 }
      );
    }

    await db
      .update(members)
      .set({ role })
      .where(and(eq(members.id, memberId), eq(members.projectId, projectId)));

    return NextResponse.json(
      { message: "Member role updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating member role:", error);
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
});
