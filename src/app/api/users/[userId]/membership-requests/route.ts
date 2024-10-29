import { auth } from "@/auth";
import db from "@/database/db";
import { membershipRequests } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = auth(async (req) => {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const requests = await db.query.membershipRequests.findMany({
      where: and(eq(membershipRequests.requesterId, req.auth.user.id)),
      with: {
        project: true,
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching user requests:", error);
    return NextResponse.json(
      { message: "Failed to fetch user requests" },
      { status: 500 }
    );
  }
});
