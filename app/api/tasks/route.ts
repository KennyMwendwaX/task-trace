import prisma from "@/prisma/db";
import { Status } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany();
    if (tasks) {
      return NextResponse.json({ tasks }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Failed to return tasks" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, Try again later" },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  const req = await request.json();
  const { name, label, priority, due_date, assignedTo, description } = req;

  try {
    const task = await prisma.task.create({
      data: {
        name,
        label,
        priority,
        due_date,
        assignedTo,
        description,
        status: Status.TO_DO,
      },
    });

    if (task) {
      return NextResponse.json(
        { message: "Task created successfully" },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to create task" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
