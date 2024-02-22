import db from "@/database/db";
import { members } from "@/database/schema";
import { eq } from "drizzle-orm";
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
    const member = await db.query.members.findFirst({
      where: (fields, operators) => operators.eq(fields.id, memberId),
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
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
    const deletedMember = await db
      .delete(members)
      .where(eq(members.id, memberId));

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
