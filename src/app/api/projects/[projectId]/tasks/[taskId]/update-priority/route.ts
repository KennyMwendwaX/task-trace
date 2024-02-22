import { taskSchema } from "@/lib/schema/TaskSchema";
import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/database/db";
import { tasks } from "@/database/schema";

// Define a request schema using Zod for type safety
const requestSchema = z.object({
  priority: taskSchema.shape.priority,
});

export async function PUT(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  const taskId = params.taskId;

  const priority = await request.json();

  // Parse the request body using the requestSchema
  const result = requestSchema.safeParse({ priority });

  if (!result.success)
    return NextResponse.json(
      { message: "Invalid request data" },
      { status: 400 }
    );

  try {
    const updatedTask = await db.update(tasks).set({
      priority: result.data.priority,
    });

    if (!updatedTask)
      return NextResponse.json(
        { message: "Failed to change priority" },
        { status: 500 }
      );

    return NextResponse.json({ message: "Priority changed" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
