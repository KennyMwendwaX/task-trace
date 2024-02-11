import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id)
    return NextResponse.json({ message: "No user Id found" }, { status: 404 });

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
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
      { status: 200 }
    );
  }
}
