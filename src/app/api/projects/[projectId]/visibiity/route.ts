import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/database/db";
import { projects, members } from "@/database/schema";
import { eq, and, or } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;
    const { isPublic } = await request.json();

    const userMembership = await db.query.members.findFirst({
      where: and(
        eq(members.userId, session.user.id),
        eq(members.projectId, projectId),
        eq(members.role, "OWNER"),
        or(eq(members.role, "ADMIN"))
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

    return NextResponse.json(updatedProject[0], { status: 200 });
  } catch (error) {
    console.error("Error updating project visibility:", error);
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}