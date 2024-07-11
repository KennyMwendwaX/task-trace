import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/database/db";
import { members, users } from "@/database/schema";
import { eq } from "drizzle-orm";

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

    if (session.user.id !== userId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const userProjects = await db.query.members.findMany({
      where: eq(members.userId, userId),
      with: {
        project: true,
      },
    });

    if (userProjects.length === 0) {
      return NextResponse.json(
        { message: "No projects found" },
        { status: 404 }
      );
    }

    const projects = userProjects.map(({ project, role }) => ({
      ...project,
      memberRole: role,
    }));

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
