import { taskFormSchema } from "@/lib/schema";
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

  // Convert 'due_date' string to a Date object
  const parsedData = {
    ...req,
    due_date: new Date(req.due_date),
  };

  // Apply Zod schema to validate and parse the request data
  const validatedData = taskFormSchema.parse(parsedData);

  if (!validatedData)
    return NextResponse.json(
      { message: "Invalid request data" },
      { status: 400 }
    );

  try {
    const task = await prisma.task.create({
      data: {
        ...validatedData,
        status: Status.TO_DO,
      },
    });

    if (!task)
      return NextResponse.json(
        { message: "Failed to create task" },
        { status: 500 }
      );

    return NextResponse.json(
      { message: "Task created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
