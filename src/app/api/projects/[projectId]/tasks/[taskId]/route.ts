import { taskFormSchema } from "@/lib/schema/TaskSchema";
import { NextResponse } from "next/server";
import db from "@/database/db";
import { and, eq } from "drizzle-orm";
import { members, tasks } from "@/database/schema";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string; taskId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, taskId } = params;

    if (!projectId || !taskId)
      return NextResponse.json(
        { message: "Project ID and Task ID are required" },
        { status: 400 }
      );

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
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
  { params }: { params: { projectId: string; taskId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, taskId } = params;

    if (!projectId || !taskId)
      return NextResponse.json(
        { message: "Project ID and Task ID are required" },
        { status: 400 }
      );

    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (!task)
      return NextResponse.json({ message: "Task not found" }, { status: 404 });

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
        { message: "You don't have permission to update tasks" },
        { status: 403 }
      );
    }

    const req = await request.json();

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
      where: eq(members.id, memberId),
    });

    if (!member)
      return NextResponse.json(
        { message: "Member not found" },
        { status: 400 }
      );

    await db
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
  { params }: { params: { projectId: string; taskId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, taskId } = params;

    if (!projectId || !taskId)
      return NextResponse.json(
        { message: "Project ID and Task ID are required" },
        { status: 400 }
      );

    const member = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, session.user.id)
      ),
    });

    if (!member) {
      return NextResponse.json(
        {
          message: "You are not a member of this project",
        },
        { status: 403 }
      );
    }

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
        { message: "You don't have permission to delete tasks" },
        { status: 403 }
      );
    }

    await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)));

    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
