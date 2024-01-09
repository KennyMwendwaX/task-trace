import { taskFormSchema } from "@/lib/schema/TaskSchema";
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
      { status: 200 }
    );

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        tasks: true,
      },
    });

    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );

    const tasks = project.tasks;

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, Try again later" },
      { status: 500 }
    );
  }
}
