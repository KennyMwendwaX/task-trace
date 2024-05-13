import { auth } from "@/auth";
import db from "@/database/db";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { invitationCodes } from "@/database/schema";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const projectId = params.projectId;

    const project = await db.query.projects.findFirst({
      where: (project, { eq }) => eq(project.id, projectId),
      with: {
        invitationCode: {
          columns: {
            code: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "No project found" },
        { status: 404 }
      );
    }

    const code = project.invitationCode.code;

    return NextResponse.json({ code }, { status: 200 });
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

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const userId = session.user.id;
    const projectId = params.projectId;

    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
      with: {
        members: {
          where: (member, { eq }) => eq(member.projectId, projectId),
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Check if the user is a member of the project
    const userMembership = user.members.find(
      (member) => member.projectId === projectId
    )?.role;

    if (!userMembership || !["OWNER", "ADMIN"].includes(userMembership)) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const code = nanoid(10);

    await db.insert(invitationCodes).values({
      code,
      projectId,
    });

    return NextResponse.json({ code }, { status: 201 });
  } catch (error) {
    console.log("Error generating invitation code:", error);
    return NextResponse.json(
      { message: "Failed to generate invitation code" },
      { status: 500 }
    );
  }
}
