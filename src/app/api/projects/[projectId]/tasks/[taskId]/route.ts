import { taskFormSchema } from "@/lib/schema/TaskSchema";
import { NextResponse } from "next/server";
import db from "@/database/db";
import { eq } from "drizzle-orm";
import { tasks } from "@/database/schema";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const taskId = params.taskId;

    if (!taskId)
      return NextResponse.json(
        { message: "No task Id found" },
        { status: 404 }
      );

    const task = await db.query.tasks.findFirst({
      where: (task, { eq }) => eq(task.id, taskId),
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
  try {
    const req = await request.json();

    const taskId = params.taskId;

    if (!taskId)
      return NextResponse.json({ message: "No task Id" }, { status: 404 });

    const task = await db.query.tasks.findFirst({
      where: (task, { eq }) => eq(task.id, taskId),
    });

    if (!task)
      return NextResponse.json({ message: "Task not found" }, { status: 404 });

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

    const updatedTask = await db
      .update(tasks)
      .set({
        name: name,
        label: label,
        priority: priority,
        dueDate: dueDate,
        memberId: memberId,
        description: description,
      })
      .where(eq(tasks.id, taskId));

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
  try {
    const taskId = params.taskId;

    if (!taskId)
      return NextResponse.json({ message: "No id provided" }, { status: 400 });

    const deletedTask = await db.delete(tasks).where(eq(tasks.id, taskId));

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
