import { taskSchema } from "@/lib/schema";
import prisma from "@/prisma/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define a request schema using Zod for type safety
const requestSchema = z.object({
  priority: taskSchema.shape.priority,
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const req = await request.json();

  // Parse the request body using the requestSchema
  const priority = requestSchema.parse(req);

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        priority: priority,
      },
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
