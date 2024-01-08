import { memberFormSchema } from "@/lib/schema/UserSchema";
import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;

  if (!projectId)
    return NextResponse.json(
      { message: "No project Id found" },
      { status: 404 }
    );
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        members: { include: { user: true } },
      },
    });

    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    const members = project.members;

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
  { params }: { params: { id: string } }
) {
  const req = await request.json();

  const projectId = params.id;

  if (!projectId)
    return NextResponse.json(
      { message: "No project Id found" },
      { status: 404 }
    );

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 400 }
      );

    const result = memberFormSchema.safeParse(req);

    if (!result.success)
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });

    const { userId, role } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 400 });

    const member = await prisma.member.create({
      data: {
        role: role,
        userId: user.id,
        projectId: project.id,
      },
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
