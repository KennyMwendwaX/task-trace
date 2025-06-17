"use server";

import { auth } from "@/lib/auth";
import { BookmarkActionError } from "@/lib/errors";
import db from "@/server/database";
import {
  members,
  projectBookmarks,
  projects,
  PublicProject,
  tasks,
  users,
} from "@/server/database/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { headers } from "next/headers";

export async function getUserBookmarkedProjects(
  userId: string
): Promise<PublicProject[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new BookmarkActionError(
        "UNAUTHORIZED",
        "No active session found",
        "getUserBookmarkedProjects"
      );
    }

    if (!userId || userId !== session.user.id) {
      throw new BookmarkActionError(
        "UNAUTHORIZED",
        "User ID mismatch or missing",
        "getUserBookmarkedProjects"
      );
    }

    const userIdNum = parseInt(session.user.id);

    const bookmarkedProjects = await db
      .select({
        // Project fields
        id: projects.id,
        name: projects.name,
        status: projects.status,
        description: projects.description,
        isPublic: projects.isPublic,
        ownerId: projects.ownerId,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,

        // Aggregated counts using subqueries
        totalTasksCount: sql<number>`(
        SELECT COUNT(*)::int 
        FROM ${tasks} 
        WHERE ${tasks.projectId} = ${projects.id}
      )`,

        completedTasksCount: sql<number>`(
        SELECT COUNT(*)::int 
        FROM ${tasks} 
        WHERE ${tasks.projectId} = ${projects.id} 
        AND ${tasks.status} = 'DONE'
      )`,

        memberCount: sql<number>`(
        SELECT COUNT(*)::int 
        FROM ${members} 
        WHERE ${members.projectId} = ${projects.id}
      )`,
      })
      .from(projectBookmarks)
      .innerJoin(projects, eq(projectBookmarks.projectId, projects.id))
      .where(eq(projectBookmarks.userId, userIdNum))
      .orderBy(projectBookmarks.createdAt);

    if (bookmarkedProjects.length === 0) {
      return [];
    }

    const projectIds = bookmarkedProjects.map((p) => p.id);

    // Optimized member query with DISTINCT ON for PostgreSQL (limits to 3 per project)
    const projectMembers = await db
      .select({
        projectId: members.projectId,
        userId: users.id,
        userName: users.name,
        userEmail: users.email,
        userImage: users.image,
        rowNum: sql<number>`ROW_NUMBER() OVER (PARTITION BY ${members.projectId} ORDER BY ${members.createdAt})`,
      })
      .from(members)
      .innerJoin(users, eq(members.userId, users.id))
      .where(inArray(members.projectId, projectIds));

    // Filter to first 3 members per project
    const limitedMembers = projectMembers.filter((m) => m.rowNum <= 3);

    // Group members by project
    const membersByProject = new Map<number, any[]>();
    limitedMembers.forEach((member) => {
      if (!membersByProject.has(member.projectId)) {
        membersByProject.set(member.projectId, []);
      }
      membersByProject.get(member.projectId)!.push({
        id: member.userId,
        name: member.userName,
        email: member.userEmail,
        image: member.userImage,
      });
    });

    // Transform to final format
    const transformedBookmarks: PublicProject[] = bookmarkedProjects.map(
      (project) => ({
        id: project.id,
        name: project.name,
        status: project.status,
        description: project.description,
        isPublic: project.isPublic,
        ownerId: project.ownerId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        totalTasksCount: project.totalTasksCount,
        completedTasksCount: project.completedTasksCount,
        memberCount: project.memberCount,
        members: membersByProject.get(project.id) || [],
      })
    );

    return transformedBookmarks;
  } catch (error) {
    if (error instanceof BookmarkActionError) {
      throw error;
    }
    throw new BookmarkActionError(
      "DATABASE_ERROR",
      "Failed to fetch user quiz bookmarks",
      "getUserBookmarkedProjects"
    );
  }
}

export const toggleProjectBookmark = async (
  projectId: string
): Promise<{ isBookmarked: boolean }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new BookmarkActionError(
        "UNAUTHORIZED",
        "No active session found",
        "toggleProjectBookmark"
      );
    }

    const userId = parseInt(session.user.id);
    const projectIdNum = parseInt(projectId);

    const existingBookmark = await db.query.projectBookmarks.findFirst({
      where: and(
        eq(projectBookmarks.projectId, projectIdNum),
        eq(projectBookmarks.userId, userId)
      ),
    });

    // If bookmark exists, remove it
    if (existingBookmark) {
      await db
        .delete(projectBookmarks)
        .where(
          and(
            eq(projectBookmarks.projectId, projectIdNum),
            eq(projectBookmarks.userId, userId)
          )
        );

      return {
        isBookmarked: false,
      };
    }

    // If bookmark doesn't exist, create it
    await db.insert(projectBookmarks).values({
      projectId: projectIdNum,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      isBookmarked: true,
    };
  } catch (error) {
    if (error instanceof BookmarkActionError) {
      throw error;
    }
    throw new BookmarkActionError(
      "DATABASE_ERROR",
      "Failed to toggle quiz bookmark",
      "toggleProjectBookmark"
    );
  }
};
