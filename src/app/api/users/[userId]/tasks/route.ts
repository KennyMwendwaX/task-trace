import db from "@/database/db";
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

    const tasks = await db.query.tasks.findMany({
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (!tasks)
      return NextResponse.json({ message: "No tasks found" }, { status: 404 });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, Try again later" },
      { status: 500 }
    );
  }
}
