import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/database/db";
import { members, projects } from "@/database/schema";
import { and, eq } from "drizzle-orm";

export const DELETE = auth(async (req) => {
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

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, req.auth.user.id)
      ),
    });

    if (!currentUserMember) {
      return NextResponse.json(
        { message: "You are not a member of this project" },
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

    if (project.ownerId === req.auth.user.id) {
      return NextResponse.json(
        {
          message:
            "Project owner cannot leave the project. Transfer ownership first.",
        },
        { status: 403 }
      );
    }

    await db
      .delete(members)
      .where(
        and(
          eq(members.projectId, projectId),
          eq(members.userId, req.auth.user.id)
        )
      );

    return NextResponse.json(
      { message: "You have successfully left the project" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error leaving project:", error);
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
});
