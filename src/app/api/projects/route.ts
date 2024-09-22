import { NextResponse } from "next/server";
import { projectFormSchema } from "@/lib/schema/ProjectSchema";
import { auth } from "@/auth";
import db from "@/database/db";
import { members, projects, users } from "@/database/schema";
import { eq } from "drizzle-orm";

export const GET = auth(async (req) => {
  if (!req.auth)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const projects = await db.query.projects.findMany();

    if (projects.length === 0) {
      return NextResponse.json(
        { message: "No projects found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
});

export const POST = auth(async (req) => {
  if (!req.auth)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const userId = req.auth.user?.id;

    if (!userId)
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 400 }
      );

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const requestData = await req.json();

    const validation = projectFormSchema.safeParse(requestData);

    if (!validation.success)
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );

    const { name, status, description } = validation.data;

    const projectResult = await db
      .insert(projects)
      .values({
        name: name,
        description: description,
        status: status,
        ownerId: user.id,
      })
      .returning({ id: projects.id });

    if (projectResult.length === 0) {
      return NextResponse.json(
        { message: "Failed to create project" },
        { status: 500 }
      );
    }

    const projectId = projectResult[0].id;

    await db.insert(members).values({
      role: "OWNER",
      userId: user.id,
      projectId: projectId,
    });

    return NextResponse.json(
      {
        message: "Project created successfully",
        projectId: projectId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
});
