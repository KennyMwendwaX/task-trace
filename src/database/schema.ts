import {
  timestamp,
  pgTable,
  text,
  integer,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  Label,
  MembershipRequestStatus,
  Priority,
  ProjectRole,
  ProjectStatus,
  Status,
} from "@/lib/config";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});

export const verifications = pgTable("verifications", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").$type<ProjectStatus>().notNull(),
  description: text("description").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
});

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  role: text("role").$type<ProjectRole>().default("MEMBER").notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  label: text("label").$type<Label>().notNull(),
  status: text("status").$type<Status>().notNull(),
  priority: text("priority").$type<Priority>().notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date", { mode: "date", precision: 3 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
  memberId: integer("member_id").references(() => members.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const invitationCodes = pgTable("invitation_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { mode: "date", precision: 3 }),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const membershipRequests = pgTable("membership_requests", {
  id: serial("id").primaryKey(),
  status: text("status")
    .$type<MembershipRequestStatus>()
    .default("PENDING")
    .notNull(),
  requesterId: integer("requester_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  members: many(members),
  membershipRequests: many(membershipRequests),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  members: many(members),
  tasks: many(tasks),
  invitationCode: one(invitationCodes, {
    fields: [projects.id],
    references: [invitationCodes.projectId],
  }),
  membershipRequests: many(membershipRequests),
}));

export const membersRelations = relations(members, ({ one, many }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [members.projectId],
    references: [projects.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  member: one(members, {
    fields: [tasks.memberId],
    references: [members.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));

export const invitationCodesRelations = relations(
  invitationCodes,
  ({ one }) => ({
    project: one(projects, {
      fields: [invitationCodes.projectId],
      references: [projects.id],
    }),
  })
);

export const membershipRequestsRelations = relations(
  membershipRequests,
  ({ one }) => ({
    project: one(projects, {
      fields: [membershipRequests.projectId],
      references: [projects.id],
    }),
    user: one(users, {
      fields: [membershipRequests.requesterId],
      references: [users.id],
    }),
  })
);

export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Member = typeof members.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type InvitationCode = typeof invitationCodes.$inferSelect;
export type MembershipRequest = typeof membershipRequests.$inferSelect;
export type PublicProject = Project & {
  totalTasksCount: number;
  completedTasksCount: number;
  memberCount: number;
  members: {
    id: number;
    name: string;
    email: string;
    image: string | null;
  }[];
};
export type MemberProject = Project & {
  memberRole: ProjectRole;
  totalTasksCount: number;
  completedTasksCount: number;
  memberCount: number;
  members: {
    id: number;
    name: string;
    email: string;
    image: string | null;
  }[];
};
