import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id)
    return NextResponse.json({ message: "No task Id found" }, { status: 404 });

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: id,
      },
    });

    if (!task)
      return NextResponse.json(
        { message: "Failed to return task" },
        { status: 404 }
      );

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, Try again later" },
      { status: 200 }
    );
  }
}
