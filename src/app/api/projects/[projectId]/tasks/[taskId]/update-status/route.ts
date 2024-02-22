import { taskSchema } from "@/lib/schema/TaskSchema";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/database/db";
import { tasks } from "@/database/schema";

// Define a request schema using Zod for type safety
const requestSchema = z.object({
  status: taskSchema.shape.status,
});

export async function PUT(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  const taskId = params.taskId;

  const status = await request.json();

  // Parse the request body using the requestSchema
  const result = requestSchema.safeParse({ status });

  if (!result.success)
    return NextResponse.json(
      { message: "Invalid request data" },
      { status: 400 }
    );

  try {
    const updatedTask = await db.update(tasks).set({
      status: result.data.status,
    });

    if (!updatedTask)
      return NextResponse.json(
        { message: "Failed to change status" },
        { status: 500 }
      );

    return NextResponse.json({ message: "Status changed" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
