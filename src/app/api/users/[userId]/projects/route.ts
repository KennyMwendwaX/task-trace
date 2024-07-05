import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/database/db";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        members: {
          with: {
            project: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const projects = user.members.map((member) => ({
      ...member.project,
      userRole: member.role,
    }));

    if (projects.length === 0) {
      return NextResponse.json(
        { message: "No projects found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
