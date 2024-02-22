import db from "@/database/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await db.query.users.findMany();

    if (!users)
      return NextResponse.json(
        { message: "Failed to return users" },
        { status: 404 }
      );

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error, try again later" });
  }
}
