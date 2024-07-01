import { memberFormSchema } from "@/lib/schema/MemberSchema";
import { NextResponse } from "next/server";
import db from "@/database/db";
import { members } from "@/database/schema";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;

    if (!projectId)
      return NextResponse.json(
        { message: "No project Id found" },
        { status: 404 }
      );
    const project = await db.query.projects.findFirst({
      where: (project, { eq }) => eq(project.id, projectId),
    });

    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );

    const members = await db.query.members.findMany({
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
        tasks: true,
      },
    });

    return NextResponse.json({ members }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const req = await request.json();

  const projectId = params.projectId;

  if (!projectId)
    return NextResponse.json(
      { message: "No project Id found" },
      { status: 404 }
    );

  try {
    const project = await db.query.projects.findFirst({
      where: (project, { eq }) => eq(project.id, projectId),
    });

    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 400 }
      );

    const validation = memberFormSchema.safeParse(req);

    if (!validation.success)
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });

    const { userId, role } = validation.data;

    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
    });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 400 });

    const member = await db.insert(members).values({
      role: role,
      userId: userId,
      projectId: projectId,
    });

    if (!member)
      return NextResponse.json(
        { message: "Failed to add member" },
        { status: 500 }
      );

    return NextResponse.json(
      { message: "Member added to project" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
