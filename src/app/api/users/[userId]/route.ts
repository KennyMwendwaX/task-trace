import { auth } from "@/auth";
import db from "@/database/db";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;

    if (!userId)
      return NextResponse.json(
        { message: "No user Id found" },
        { status: 400 }
      );

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
}
