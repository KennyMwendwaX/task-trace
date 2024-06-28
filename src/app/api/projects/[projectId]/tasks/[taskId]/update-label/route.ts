import { taskSchema } from "@/lib/schema/TaskSchema";
import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/database/db";
import { tasks } from "@/database/schema";

// Define a request schema using Zod for type safety
const requestSchema = z.object({
  label: taskSchema.shape.label,
});

export async function PUT(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId;

    const label = await request.json();

    const validation = requestSchema.safeParse({ label });

    if (!validation.success)
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );

    const updatedTask = await db.update(tasks).set({
      label: validation.data.label,
    });

    if (!updatedTask)
      return NextResponse.json(
        { message: "Failed to change label" },
        { status: 500 }
      );

    return NextResponse.json({ message: "Label changed" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
