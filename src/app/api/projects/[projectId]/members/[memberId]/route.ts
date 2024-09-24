import { auth } from "@/auth";
import db from "@/database/db";
import { members, projects } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = auth(async (req) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const segments = req.nextUrl.pathname.split("/");
    const projectId = segments[segments.length - 3];
    const memberId = segments[segments.length - 1];

    if (!projectId || !memberId) {
      return NextResponse.json(
        { message: "Project ID and Member ID are required" },
        { status: 400 }
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, req.auth.user.id)
      ),
    });

    if (!currentUserMember) {
      return NextResponse.json(
        { message: "You are not a member of the project" },
        { status: 403 }
      );
    }

    const member = await db.query.members.findFirst({
      where: and(eq(members.id, memberId), eq(projects.id, projectId)),
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!member)
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );

    return NextResponse.json({ member }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, Try again later" },
      { status: 500 }
    );
  }
});

export const DELETE = auth(async (req) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const segments = req.nextUrl.pathname.split("/");
    const projectId = segments[segments.length - 3];
    const memberId = segments[segments.length - 1];

    if (!projectId || !memberId) {
      return NextResponse.json(
        { message: "Project ID and Member ID are required" },
        { status: 400 }
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(eq(members.id, memberId), eq(members.projectId, projectId)),
    });

    if (!currentUserMember) {
      return NextResponse.json(
        { message: "Member not found" },
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

    if (
      project.ownerId === req.auth.user.id &&
      currentUserMember.userId === req.auth.user.id
    ) {
      return NextResponse.json(
        {
          message:
            "Project owner cannot leave the project. Transfer ownership first.",
        },
        { status: 403 }
      );
    }

    if (
      project.ownerId === req.auth.user.id ||
      currentUserMember.role === "ADMIN" ||
      currentUserMember.userId === req.auth.user.id
    ) {
      await db
        .delete(members)
        .where(and(eq(members.id, memberId), eq(members.projectId, projectId)));

      return NextResponse.json(
        { message: "Member removed successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "You are not authorized to remove this member" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
});
