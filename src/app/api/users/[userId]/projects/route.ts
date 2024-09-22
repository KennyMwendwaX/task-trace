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
    const userId = req.nextUrl.pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json(
        { message: "No user Id found" },
        { status: 400 }
      );
    }

    if (req.auth.user.id !== userId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const userProjects = await db.query.members.findMany({
      where: eq(members.userId, userId),
      with: {
        project: true,
        tasks: true,
      },
    });

    if (userProjects.length === 0) {
      return NextResponse.json(
        { message: "No projects found" },
        { status: 404 }
      );
    }

    const projects = userProjects.map(({ project, role, tasks }) => ({
      ...project,
      memberRole: role,
      totalTasksCount: tasks.length,
      completedTasksCount: tasks.filter((task) => task.status === "DONE")
        .length,
      memberCount: userProjects.filter(
        (member) => member.projectId === project.id
      ).length,
    }));

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
});
