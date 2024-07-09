import { auth } from "@/auth";
import db from "@/database/db";
import { members, projects } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const memberId = params.memberId;

    if (!memberId)
      return NextResponse.json(
        { message: "No member Id found" },
        { status: 404 }
      );

    const member = await db.query.members.findFirst({
      where: (member, { eq }) => eq(member.id, memberId),
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
}

export async function DELETE(
  request: Request,
  { params }: { params: { projectId: string; memberId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, memberId } = params;

    if (!projectId || !memberId) {
      return NextResponse.json(
        { message: "Project ID and Member ID are required" },
        { status: 400 }
      );
    }

    const member = await db.query.members.findFirst({
      where: and(
        eq(members.id, memberId),
        eq(members.projectId, projectId),
        eq(members.userId, session.user.id)
      ),
    });

    if (!member) {
      return NextResponse.json(
        {
          message: "You are not a member of this project",
        },
        { status: 403 }
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (project?.ownerId === session.user.id) {
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
          eq(members.id, memberId),
          eq(members.projectId, projectId),
          eq(members.userId, session.user.id)
        )
      );

    return NextResponse.json(
      { message: "Successfully left the project" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error leaving project:", error);
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
