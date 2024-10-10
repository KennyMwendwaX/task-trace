import { taskSchema } from "@/lib/schema/TaskSchema";
import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/database/db";
import { members, projects, tasks } from "@/database/schema";
import { auth } from "@/auth";
import { and, eq } from "drizzle-orm";

const requestSchema = z.object({
  status: taskSchema.shape.status,
});

export const PATCH = auth(async (req) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const segments = req.nextUrl.pathname.split("/");
    const projectId = segments[segments.length - 4];
    const taskId = segments[segments.length - 2];
    console.log(projectId, taskId);

    if (!projectId || !taskId) {
      return NextResponse.json(
        { message: "Project ID and Task ID are required" },
        { status: 400 }
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, req.auth.user.id)
      ),
    });

    if (!currentUserMember) {
      return NextResponse.json(
        { message: "You are not a member of the project" },
        { status: 403 }
      );
    }

    const task = await db.query.tasks.findFirst({
      where: and(eq(tasks.id, taskId), eq(projects.id, projectId)),
    });

    if (!task)
      return NextResponse.json({ message: "Task not found" }, { status: 404 });

    if (
      currentUserMember.role !== "OWNER" &&
      currentUserMember.role !== "ADMIN" &&
      task.memberId !== currentUserMember.id
    ) {
      return NextResponse.json(
        { message: "You are not authorized to modify this task" },
        { status: 403 }
      );
    }

    const status = await req.json();
    const validation = requestSchema.safeParse({ status });

    if (!validation.success)
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );

    await db
      .update(tasks)
      .set({
        status: validation.data.status,
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)));

    return NextResponse.json({ message: "Status changed" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
});
