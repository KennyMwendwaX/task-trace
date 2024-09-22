import { auth } from "@/auth";
import db from "@/database/db";
import { users } from "@/database/schema";
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

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user)
      return NextResponse.json(
        { message: "Failed to return user" },
        { status: 404 }
      );

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, Try again later" },
      { status: 500 }
    );
  }
});
