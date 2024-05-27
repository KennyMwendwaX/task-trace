import db from "@/database/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id)
    return NextResponse.json({ message: "No user Id found" }, { status: 400 });

  try {
    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, id),
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
