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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const req = await request.json();

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
    });

    if (!project)
      return NextResponse.json(
        { message: "Project not found" },
        { status: 400 }
      );

    const requestData = {
      ...req,
      due_date: new Date(req.due_date),
    };

    const result = taskFormSchema.safeParse(requestData);

    if (!result.success)
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });

    const { name, label, priority, due_date, memberId, description } =
      result.data;

    const member = await prisma.member.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!member)
      return NextResponse.json(
        { message: "Member not found" },
        { status: 400 }
      );

    const task = await prisma.task.create({
      data: {
        name,
        label,
        priority,
        due_date,
        description,
        status: "TO_DO",
        memberId: memberId,
        projectId: projectId,
      },
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
