import db from "@/database/db";
import { members } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId)
      return NextResponse.json(
        { message: "No user Id found" },
        { status: 400 }
      );

    const userTasks = await db.query.members.findMany({
      where: eq(members.userId, userId),
      with: {
        tasks: true,
      },
    });

    if (!userTasks || userTasks.length === 0) {
      return NextResponse.json({ message: "No tasks found" }, { status: 404 });
    }

    const tasks = userTasks.flatMap((member) => member.tasks);

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, Try again later" },
      { status: 500 }
    );
  }
}
