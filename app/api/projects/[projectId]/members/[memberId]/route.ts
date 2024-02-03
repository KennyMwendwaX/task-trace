import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  const memberId = params.memberId;

  if (!memberId)
    return NextResponse.json(
      { message: "No member Id found" },
      { status: 404 }
    );

  try {
    const member = await prisma.member.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!member)
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );

    return NextResponse.json({ member }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, Try again later" },
      { status: 500 }
    );
  }
}
