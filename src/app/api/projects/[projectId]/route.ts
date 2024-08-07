import db from "@/database/db";
import { members, projects } from "@/database/schema";
import { projectFormSchema } from "@/lib/schema/ProjectSchema";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;

    if (!projectId)
      return NextResponse.json(
        { message: "No project Id found" },
        { status: 404 }
      );

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, session.user.id)
      ),
    });

    if (!currentUserMember) {
      return NextResponse.json(
        { message: "You are not a member of the project" },
        { status: 403 }
      );
    }

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
      with: {
        owner: {
          columns: {
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

export async function PUT(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = params;

    if (!projectId)
      return NextResponse.json(
        { message: "No project Id found" },
        { status: 404 }
      );

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, session.user.id)
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      return NextResponse.json(
        { message: "You don't have permission to add tasks to this project" },
        { status: 403 }
      );
    }

    const req = await request.json();

    const validation = projectFormSchema.safeParse(req);

    if (!validation.success)
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });

    const { name, status, description } = validation.data;

    await db
      .update(projects)
      .set({
        name: name,
        status: status,
        description: description,
      })
      .where(eq(projects.id, projectId));

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
