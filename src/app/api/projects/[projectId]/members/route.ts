import { memberFormSchema } from "@/lib/schema/MemberSchema";
import { NextResponse } from "next/server";
import db from "@/database/db";
import { members, projects, users } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";

export const GET = auth(async (req) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const segments = req.nextUrl.pathname.split("/");
    const projectId = segments[segments.length - 2];

    if (!projectId)
      return NextResponse.json(
        { message: "No project Id found" },
        { status: 404 }
      );

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

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );

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

    return NextResponse.json({ members: projectMembers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
});

export const POST = auth(async (req) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const segments = req.nextUrl.pathname.split("/");
    const projectId = segments[segments.length - 2];

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
