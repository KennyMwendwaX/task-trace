import { auth } from "@/auth";
import db from "@/database/db";
import { members, membershipRequests, projects } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = auth(async (req) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const segments = req.nextUrl.pathname.split("/");
    const projectId = segments[segments.length - 2];

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
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

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error("Error getting project membership requests:", error);
    return NextResponse.json(
      { message: "Server error, please try again later" },
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

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    const existingMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, req.auth.user.id)
      ),
    });

    if (existingMember) {
      return NextResponse.json(
        { message: "User is already a member of this project" },
        { status: 400 }
      );
    }

    const existingRequest = await db.query.membershipRequests.findFirst({
      where: and(
        eq(membershipRequests.projectId, projectId),
        eq(membershipRequests.requesterId, req.auth.user.id),
        eq(membershipRequests.status, "PENDING")
      ),
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: "A pending request already exists" },
        { status: 400 }
      );
    }

    await db.insert(membershipRequests).values({
      requesterId: req.auth.user.id,
      projectId,
      status: "PENDING",
    });

    return NextResponse.json(
      { message: "Membership request successfully sent" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending membership request:", error);
    return NextResponse.json(
      { message: "Server error, please try again later" },
      { status: 500 }
    );
  }
});
