import { NextResponse } from "next/server";
import { projectFormSchema } from "@/lib/schema/ProjectSchema";
import { auth } from "../../../auth";
import db from "@/database/db";
import { members, projects } from "@/database/schema";
import { ProjectStatus } from "@/lib/config";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const userId = session.user.id;

    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, userId),
      with: {
        projects: true,
        pinnedProjects: {
          with: {
            project: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const projectsData = user.projects;
    if (!projectsData)
      return NextResponse.json(
        { message: "No projects found" },
        { status: 404 }
      );

    const pinnedProjects = user.pinnedProjects.map((pp) => pp.project);
    const pinnedProjectIds = pinnedProjects.map((pp) => pp.id);

    // Filter pinned projects
    const otherProjects = projectsData.filter(
      (project) => !pinnedProjectIds.includes(project.id)
    );

    return NextResponse.json(
      { pinnedProjects, otherProjects },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const userId = session.user.id;

  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
  });

  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  const req = await request.json();

  const requestData = {
    ...req,
    start_date: new Date(req.start_date),
    end_date: new Date(req.end_date),
  };

  const result = projectFormSchema.safeParse(requestData);

  if (!result.success)
    return NextResponse.json(
      { message: "Invalid request data" },
      { status: 400 }
    );

  const { name, label, start_date, end_date, description } = result.data;

  try {
    const projectResult = await db
      .insert(projects)
      .values({
        name,
        label,
        startDate: start_date,
        endDate: end_date,
        description,
        status: "BUILDING" as ProjectStatus,
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
      { message: "Project created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
