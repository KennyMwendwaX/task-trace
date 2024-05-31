import { auth } from "@/auth";
import db from "@/database/db";
import { members } from "@/database/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { code } = await request.json();
    const userId = session.user.id;

    const invitationCode = await db.query.invitationCodes.findFirst({
      where: (invitationCodes, { eq }) => eq(invitationCodes.code, code),
    });

    if (!invitationCode) {
      return NextResponse.json(
        { message: "Invalid invitation code" },
        { status: 400 }
      );
    }

    const currentDateTime = new Date();
    if (
      invitationCode.expiresAt &&
      invitationCode.expiresAt < currentDateTime
    ) {
      return NextResponse.json(
        { message: "Invitation code expired" },
        { status: 410 }
      );
    }

    const projectId = invitationCode.projectId;

    const existingMember = await db.query.members.findFirst({
      where: (members, { and, eq }) =>
        and(eq(members.userId, userId), eq(members.projectId, projectId)),
    });

    if (existingMember) {
      return NextResponse.json({ message: "User is already a member" });
    }

    await db.insert(members).values({
      userId,
      projectId,
      role: "MEMBER",
    });

    return NextResponse.json({ projectId }, { status: 200 });
  } catch (error) {
    console.log("Error joining project: ", error);
    return NextResponse.json(
      { message: "Failed to join project" },
      { status: 500 }
    );
  }
}
