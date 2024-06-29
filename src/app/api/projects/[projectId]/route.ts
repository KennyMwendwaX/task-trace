import db from "@/database/db";
import { projects } from "@/database/schema";
import { projectFormSchema } from "@/lib/schema/ProjectSchema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;
    const project = await db.query.projects.findFirst({
      where: (project, { eq }) => eq(project.id, projectId),
      with: {
        owner: {
          columns: {
            name: true,
            email: true,
          },
        },
        invitationCode: {
          columns: {
            code: true,
            expiresAt: true,
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

export async function PUT(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const req = await request.json();

    const projectId = params.projectId;

    if (!projectId)
      return NextResponse.json({ message: "No project Id" }, { status: 404 });

    const project = await db.query.projects.findFirst({
      where: (project, { eq }) => eq(project.id, projectId),
    });

    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );

    const validation = projectFormSchema.safeParse(req);

    if (!validation.success)
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });

    const { name, status, description } = validation.data;

    const updatedProject = await db
      .update(projects)
      .set({
        name: name,
        status: status,
        description: description,
      })
      .where(eq(projects.id, projectId));

    if (!updatedProject)
      return NextResponse.json({ message: "Failed to update project" });

    return NextResponse.json(
      { message: "Project successfully updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
