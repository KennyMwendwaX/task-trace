import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/database/db";
import { members } from "@/database/schema";
import { eq } from "drizzle-orm";

export const GET = auth(async (req) => {
  if (!req.auth || !req.auth.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const segments = req.nextUrl.pathname.split("/");
    const userId = segments[segments.length - 2];

    if (!userId) {
      return NextResponse.json(
        { message: "No user Id found" },
        { status: 400 }
      );
    }

    if (req.auth.user.id !== userId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // Fetch all user's projects with related data in a single query
    const userProjects = await db.query.members.findMany({
      where: eq(members.userId, userId),
      with: {
        project: {
          with: {
            tasks: true,
            members: {
              with: {
                user: true,
              },
              limit: 3,
            },
          },
        },
      },
    });

    if (userProjects.length === 0) {
      return NextResponse.json(
        { message: "No projects found" },
        { status: 404 }
      );
    }

    // Transform the data to match your desired response format
    const projects = userProjects.map(({ project, role }) => {
      const totalTasksCount = project.tasks.length;
      const completedTasksCount = project.tasks.filter(
        (task) => task.status === "DONE"
      ).length;

      return {
        ...project,
        memberRole: role,
        totalTasksCount,
        completedTasksCount,
        memberCount: project.members.length,
        members: project.members.map(({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        })),
      };
    });

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
});
