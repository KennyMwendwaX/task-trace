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
