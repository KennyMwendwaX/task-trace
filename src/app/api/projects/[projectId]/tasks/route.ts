import { taskFormSchema } from "@/lib/schema/TaskSchema";
import { NextResponse } from "next/server";
import db from "@/database/db";
import { tasks } from "@/database/schema";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;

    if (!projectId)
      return NextResponse.json(
        { message: "No project Id found" },
        { status: 404 }
      );

    const project = await db.query.projects.findFirst({
      where: (project, { eq }) => eq(project.id, projectId),
    });

    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );

    const tasks = await db.query.tasks.findMany({
      with: {
        member: {
          columns: {
            role: true,
          },
          with: {
            user: {
              columns: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, Try again later" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const req = await request.json();

  const projectId = params.projectId;

  if (!projectId)
    return NextResponse.json(
      { message: "No project Id found" },
      { status: 404 }
    );

  try {
    const project = await db.query.projects.findFirst({
      where: (project, { eq }) => eq(project.id, projectId),
    });

    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 400 }
      );

    const requestData = {
      ...req,
      dueDate: new Date(req.dueDate),
    };

    const validation = taskFormSchema.safeParse(requestData);

    if (!validation.success)
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });

    const { name, label, priority, dueDate, memberId, description } =
      validation.data;

    const member = await db.query.members.findFirst({
      where: (member, { eq }) => eq(member.id, memberId),
    });

    if (!member)
      return NextResponse.json(
        { message: "Member not found" },
        { status: 400 }
      );

    const task = await db.insert(tasks).values({
      name: name,
      label: label,
      priority: priority,
      dueDate: dueDate,
      description: description,
      status: "TO_DO",
      memberId: memberId,
      projectId: projectId,
    });

    if (!task)
      return NextResponse.json(
        { message: "Failed to add task" },
        { status: 500 }
      );

    return NextResponse.json(
      { message: "Task added to project" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
