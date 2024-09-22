import { auth } from "@/auth";
import db from "@/database/db";
import { members } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = auth(async (req) => {
  if (!req.auth || !req.auth.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const userId = req.nextUrl.pathname.split("/").pop();

    if (!userId)
      return NextResponse.json(
        { message: "No user Id found" },
        { status: 400 }
      );

    if (req.auth.user.id !== userId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

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
});
