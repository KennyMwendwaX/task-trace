import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/database/db";
import { projects, members } from "@/database/schema";
import { eq, and, or } from "drizzle-orm";

export const PATCH = auth(async (req) => {
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

    const { isPublic } = await req.json();

    const userMembership = await db.query.members.findFirst({
      where: and(
        eq(members.userId, req.auth.user.id),
        eq(members.projectId, projectId),
        or(eq(members.role, "OWNER"), eq(members.role, "ADMIN"))
      ),
    });

    if (!userMembership) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const updatedProject = await db
      .update(projects)
      .set({ isPublic })
      .where(eq(projects.id, projectId))
      .returning();

    if (updatedProject.length === 0) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Project visibility updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project visibility:", error);
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
});
