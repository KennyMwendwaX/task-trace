import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import {
  Label,
  MembershipRequestStatus,
  Priority,
  ProjectRole,
  ProjectStatus,
  Status,
} from "@/lib/config";

export const users = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("email_verified", { mode: "date", precision: 3 }),
  password: text("password"),
  image: text("image"),
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

export const accounts = pgTable(
  "account",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("session_token").notNull().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const projects = pgTable("project", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
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
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
});

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

export const members = pgTable("member", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  role: text("role").$type<ProjectRole>().default("MEMBER").notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

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

export const tasks = pgTable("task", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
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
  memberId: uuid("member_id").references(() => members.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

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

export const invitationCodes = pgTable("invitation_code", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  code: text("code").notNull().unique(),
  projectId: uuid("project_id")
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

export const invitationCodesRelations = relations(
  invitationCodes,
  ({ one }) => ({
    project: one(projects, {
      fields: [invitationCodes.projectId],
      references: [projects.id],
    }),
  })
);

export const membershipRequests = pgTable("membership_request", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  status: text("status")
    .$type<MembershipRequestStatus>()
    .default("PENDING")
    .notNull(),
  requesterId: uuid("requester_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  projectId: uuid("project_id")
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
