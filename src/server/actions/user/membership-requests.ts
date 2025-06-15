"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/server/database";
import {
  MembershipRequest,
  membershipRequests,
} from "@/server/database/schema";
import { eq } from "drizzle-orm";
import { MemberActionError } from "@/lib/errors";

export const getUserMembershipRequests = async (
  userId: string
): Promise<MembershipRequest[]> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getUserMembershipRequests"
      );
    }

    if (userId !== session.user.id) {
      throw new MemberActionError(
        "UNAUTHORIZED",
        "You can only view your own membership requests",
        "getUserMembershipRequests"
      );
    }

    const requests = await db.query.membershipRequests.findMany({
      where: eq(membershipRequests.requesterId, parseInt(session.user.id)),
    });

    return requests;
  } catch (error) {
    console.error("Error fetching user membership requests:", error);
    if (error instanceof MemberActionError) {
      throw error;
    }
    throw new MemberActionError(
      "DATABASE_ERROR",
      error instanceof Error
        ? error.message
        : "Failed to fetch membership requests",
      "getUserMembershipRequests"
    );
  }
};
