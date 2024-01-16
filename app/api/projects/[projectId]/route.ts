import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const projectId = params.projectId;
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });

    if (project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
