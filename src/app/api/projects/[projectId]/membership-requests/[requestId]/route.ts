import { auth } from "@/auth";
import db from "@/database/db";
import { members, membershipRequests } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const PUT = auth(async (req) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const segments = req.nextUrl.pathname.split("/");
    const projectId = segments[segments.length - 3];
    const requestId = segments[segments.length - 1];

    if (!projectId || !requestId) {
      return NextResponse.json(
        { message: "Project ID and Member ID are required" },
        { status: 400 }
      );
    }

    const requestBody = await req.json();
    const { status } = requestBody;

    if (!status || !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status provided" },
        { status: 400 }
      );
    }

    const currentUserMember = await db.query.members.findFirst({
      where: and(
        eq(members.projectId, projectId),
        eq(members.userId, req.auth.user.id)
      ),
    });

    if (
      !currentUserMember ||
      !["OWNER", "ADMIN"].includes(currentUserMember.role)
    ) {
      return NextResponse.json(
        { message: "You don't have permission to approve membership requests" },
        { status: 403 }
      );
    }

    await db
      .update(membershipRequests)
      .set({ status })
      .where(
        and(
          eq(membershipRequests.id, requestId),
          eq(membershipRequests.projectId, projectId)
        )
      );

    return NextResponse.json(
      { message: "Member request status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating membership request status:", error);
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
});
