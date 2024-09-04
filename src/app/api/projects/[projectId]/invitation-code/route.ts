import { auth } from "@/auth";
import db from "@/database/db";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { invitationCodes, members, projects } from "@/database/schema";
import add from "date-fns/add";
import { and, eq } from "drizzle-orm/sql";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;

    if (!projectId)
      return NextResponse.json(
        { message: "No project Id found" },
        { status: 404 }
      );

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 400 }
      );

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, session.user.id)
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      return NextResponse.json(
        {
          message: "You don't have permission get the project invitation code",
        },
        { status: 403 }
      );
    }

    const invitationCode = await db.query.invitationCodes.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!invitationCode) {
      return NextResponse.json(
        { message: "No invitation code found for this project" },
        { status: 404 }
      );
    }

    const currentDateTime = new Date();
    if (
      invitationCode.expiresAt &&
      invitationCode.expiresAt < currentDateTime
    ) {
      return NextResponse.json(
        { message: "Invitation code expired. Please regenerate." },
        { status: 410 }
      );
    }

    return NextResponse.json(
      { code: invitationCode.code, expiresAt: invitationCode.expiresAt },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error getting invitation code:", error);
    return NextResponse.json(
      { message: "Failed to get invitation code" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;

    if (!projectId)
      return NextResponse.json(
        { message: "No project Id found" },
        { status: 404 }
      );

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 400 }
      );

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, session.user.id)
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      return NextResponse.json(
        { message: "You don't have permission to add tasks to this project" },
        { status: 403 }
      );
    }

    const code = nanoid(10);
    const expiresAt = add(new Date(), { days: 7 });

    const existingCode = await db.query.invitationCodes.findFirst({
      where: eq(invitationCodes.projectId, projectId),
    });

    if (!existingCode) {
      await db.insert(invitationCodes).values({ code, projectId, expiresAt });
      return NextResponse.json({ code, expiresAt }, { status: 201 });
    }

    const updatedCode = await db
      .update(invitationCodes)
      .set({ code, expiresAt })
      .where(eq(invitationCodes.projectId, projectId))
      .returning();

    return NextResponse.json(
      { code: updatedCode[0].code, expiresAt: updatedCode[0].expiresAt },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error generating invitation code:", error);
    return NextResponse.json(
      { message: "Failed to generate invitation code" },
      { status: 500 }
    );
  }
}
