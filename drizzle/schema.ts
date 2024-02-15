import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";

export const users = pgTable("user", {
  id: serial("id").primaryKey().notNull(),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  password: text("password"),
  role: text("role").$type<"ADMIN" | "USER">().default("USER").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  members: many(members),
}));

export const accounts = pgTable(
  "account",
  {
    userId: integer("user_id")
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
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
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
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  label: text("label").notNull(),
  status: text("status").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  members: many(members),
}));

export const members = pgTable("member", {
  id: serial("id").primaryKey().notNull(),
  role: text("role").$type<"ADMIN" | "MEMBER">().default("MEMBER").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "restrict",
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
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  label: text("label").notNull(),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
  memberId: integer("member_id")
    .notNull()
    .references(() => members.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "restrict",
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
