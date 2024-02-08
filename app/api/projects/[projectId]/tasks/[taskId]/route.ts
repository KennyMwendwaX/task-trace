import { taskFormSchema } from "@/lib/schema/TaskSchema";
import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  const taskId = params.taskId;

  if (!taskId)
    return NextResponse.json({ message: "No task Id found" }, { status: 404 });

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task)
      return NextResponse.json({ message: "Task not found" }, { status: 404 });

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, Try again later" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  const req = await request.json();

  const taskId = params.taskId;

  if (!taskId)
    return NextResponse.json({ message: "No task Id found" }, { status: 404 });

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task)
      return NextResponse.json({ message: "Task not found" }, { status: 404 });

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

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        name,
        label,
        priority,
        due_date,
        memberId,
        description,
      },
    });

    if (!updatedTask)
      return NextResponse.json({ message: "Failed to update task" });

    return NextResponse.json(
      { message: "Task successfully updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  const taskId = params.taskId;

  if (!taskId)
    return NextResponse.json({ message: "No id provided" }, { status: 400 });

  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    if (!deletedTask)
      return NextResponse.json(
        { message: "Failed to delete task" },
        { status: 500 }
      );

    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
