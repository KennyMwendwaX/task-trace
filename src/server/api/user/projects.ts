"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/database/db";
import { MemberProject, members, projects, users } from "@/database/schema";
import { ProjectFormValues } from "@/lib/schema/ProjectSchema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getUserProjects(
  userId?: string
): Promise<MemberProject[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("No active session found");
    }

    if (!userId || userId !== session.user.id) {
      throw new Error("User ID mismatch or missing");
    }

    const userProjects = await db.query.members.findMany({
      where: eq(members.userId, parseInt(userId)),
      with: {
        project: {
          with: {
            tasks: {
              columns: {
                status: true,
              },
            },
            members: {
              with: {
                user: {
                  columns: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
              limit: 3,
            },
          },
        },
      },
    });

    if (!userProjects || userProjects.length === 0) {
      return [];
    }

    const projects = userProjects.map(({ project, role }) => {
      const { tasks, ...projectWithoutTasks } = project;
      const totalTasksCount = tasks.length;
      const completedTasksCount = tasks.filter(
        (task) => task.status === "DONE"
      ).length;

      return {
        ...projectWithoutTasks,
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

    return projects;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    throw new Error("Failed to fetch user projects");
  }
}

export async function createProject(
  formValues: ProjectFormValues
): Promise<{ projectId: number }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("No active session found");
    }

    const userId = session.user.id;

    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, parseInt(userId)),
    });

    if (!user) {
      throw new Error("User not found");
    }

    const projectResult = await db
      .insert(projects)
      .values({
        name: formValues.name,
        description: formValues.description,
        status: formValues.status,
        ownerId: user.id,
      })
      .returning({ id: projects.id });

    if (projectResult.length === 0) {
      throw new Error("Failed to create project");
    }

    const projectId = projectResult[0].id;

    await db.insert(members).values({
      role: "OWNER",
      userId: user.id,
      projectId: projectId,
    });

    revalidatePath("/projects");

    return { projectId };
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project");
  }
}
