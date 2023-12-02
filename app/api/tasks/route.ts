import prisma from "@/prisma/db";
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
