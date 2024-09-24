import { taskFormSchema } from "@/lib/schema/TaskSchema";
import { NextResponse } from "next/server";
import db from "@/database/db";
import { members, projects, tasks } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";

export const GET = auth(async (req) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const segments = req.nextUrl.pathname.split("/");
    const projectId = segments[segments.length - 2];

    if (!projectId)
      return NextResponse.json(
        { message: "No project Id found" },
        { status: 404 }
      );

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

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project)
      return NextResponse.json(
        { message: "No project Id found" },
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
});

export const POST = auth(async (req) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const segments = req.nextUrl.pathname.split("/");
    const projectId = segments[segments.length - 2];

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
        { status: 400 }
      );

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, req.auth.user.id)
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

    const requestBody = await req.json();

    const requestData = {
      ...requestBody,
      dueDate: new Date(requestBody.dueDate),
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

    await db.insert(tasks).values({
      name: name,
      label: label,
      priority: priority,
      dueDate: dueDate,
      description: description,
      status: "TO_DO",
      memberId: memberId,
      projectId: projectId,
    });

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
});
