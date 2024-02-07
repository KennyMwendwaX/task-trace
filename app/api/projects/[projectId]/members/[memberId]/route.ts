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

export async function DELETE(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  const memberId = params.memberId;

  if (!memberId)
    return NextResponse.json(
      { message: "No memberId provided" },
      { status: 400 }
    );

  try {
    const deletedMember = await prisma.member.delete({
      where: {
        id: memberId,
      },
    });

    if (!deletedMember)
      return NextResponse.json(
        { message: "Failed to delete member" },
        { status: 500 }
      );

    return NextResponse.json({ message: "Member deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
