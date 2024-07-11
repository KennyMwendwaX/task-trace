import { auth } from "@/auth";
import db from "@/database/db";
import { invitationCodes, members } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  code: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request data", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const { code } = validation.data;

    const invitationCode = await db.query.invitationCodes.findFirst({
      where: eq(invitationCodes.code, code),
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
      where: and(
        eq(members.userId, session.user.id),
        eq(members.projectId, projectId)
      ),
    });

    if (existingMember) {
      return NextResponse.json({ message: "User is already a member" });
    }

    await db.insert(members).values({
      userId: session.user.id,
      projectId: projectId,
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
