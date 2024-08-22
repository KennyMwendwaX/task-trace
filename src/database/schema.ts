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

export const user = pgTable("user", {
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

export const userRelations = relations(user, ({ many }) => ({
  project: many(project),
  member: many(member),
}));

export const account = pgTable(
  "account",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
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

export const session = pgTable("session", {
  sessionToken: text("session_token").notNull().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationToken = pgTable(
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

export const project = pgTable("project", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(),
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
    .references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" }),
});

export const projectRelations = relations(project, ({ one, many }) => ({
  owner: one(user, {
    fields: [project.ownerId],
    references: [user.id],
  }),
  member: many(member),
  invitationCode: one(invitationCode, {
    fields: [project.id],
    references: [invitationCode.projectId],
  }),
}));

export const member = pgTable("member", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  role: text("role")
    .$type<"OWNER" | "ADMIN" | "MEMBER">()
    .default("MEMBER")
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const memberRelations = relations(member, ({ one, many }) => ({
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
  project: one(project, {
    fields: [member.projectId],
    references: [project.id],
  }),
  task: many(task),
}));

export const task = pgTable("task", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  label: text("label").notNull(),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date", { mode: "date", precision: 3 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
  memberId: uuid("member_id").references(() => member.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const taskRelations = relations(task, ({ one }) => ({
  member: one(member, {
    fields: [task.memberId],
    references: [member.id],
  }),
  project: one(project, {
    fields: [task.projectId],
    references: [project.id],
  }),
}));

export const invitationCode = pgTable("invitation_code", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  code: text("code").notNull().unique(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { mode: "date", precision: 3 }),
  createdAt: timestamp("created_at", { mode: "date", precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const invitationCodeRelations = relations(invitationCode, ({ one }) => ({
  project: one(project, {
    fields: [invitationCode.projectId],
    references: [project.id],
  }),
}));
