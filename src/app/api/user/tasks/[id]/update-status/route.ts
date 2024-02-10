import { taskSchema } from "@/lib/schema/TaskSchema";
import prisma from "../../../../../../../prisma/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define a request schema using Zod for type safety
const requestSchema = z.object({
  status: taskSchema.shape.status,
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const status = await request.json();

  // Parse the request body using the requestSchema
  const validatedData = requestSchema.parse({ status });

  if (!validatedData)
    return NextResponse.json(
      { message: "Invalid request data" },
      { status: 400 }
    );

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        status: validatedData.status,
      },
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
