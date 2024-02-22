import db from "@/database/db";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const projectId = params.projectId;
  try {
    const project = await db.query.projects.findFirst({
      where: (fields, operators) => operators.eq(fields.id, projectId),
      with: {
        owner: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project)
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
