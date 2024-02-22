import { NextResponse } from "next/server";
import { projectFormSchema } from "@/lib/schema/ProjectSchema";
import { auth } from "../../../auth";
import db from "@/database/db";
import { projects } from "@/database/schema";

export async function GET() {
  try {
    const projects = await db.query.projects.findMany({
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

    if (!projects)
      return NextResponse.json(
        { message: "No projects found" },
        { status: 404 }
      );

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

  const user = await db.query.users.findFirst({
    where: (fields, operators) => operators.eq(fields.id, session.user.id),
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
    const project = await db.insert(projects).values({
      name: name,
      label: label,
      startDate: start_date,
      endDate: end_date,
      description: description,
      status: "TO_DO",
      ownerId: user.id,
    });

    if (!project)
      return NextResponse.json(
        { message: "Failed to create project" },
        { status: 500 }
      );

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
