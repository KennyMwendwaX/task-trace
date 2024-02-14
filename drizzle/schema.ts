import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
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
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
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

// import { pgTable, pgEnum, varchar, timestamp, text, integer, uniqueIndex, foreignKey } from "drizzle-orm/pg-core"
//   import { sql } from "drizzle-orm"

// export const userRole = pgEnum("UserRole", ['ADMIN', 'USER'])
// export const projectRole = pgEnum("ProjectRole", ['ADMIN', 'MEMBER'])

// export const prismaMigrations = pgTable("_prisma_migrations", {
// 	id: varchar("id", { length: 36 }).primaryKey().notNull(),
// 	checksum: varchar("checksum", { length: 64 }).notNull(),
// 	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
// 	migrationName: varchar("migration_name", { length: 255 }).notNull(),
// 	logs: text("logs"),
// 	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
// 	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
// 	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
// });

// export const verificationToken = pgTable("VerificationToken", {
// 	identifier: text("identifier").notNull(),
// 	token: text("token").notNull(),
// 	expires: timestamp("expires", { precision: 3, mode: 'string' }).notNull(),
// },
// (table) => {
// 	return {
// 		tokenKey: uniqueIndex("VerificationToken_token_key").on(table.token),
// 		identifierTokenKey: uniqueIndex("VerificationToken_identifier_token_key").on(table.identifier, table.token),
// 	}
// });

// export const user = pgTable("User", {
// 	id: text("id").primaryKey().notNull(),
// 	name: text("name").notNull(),
// 	email: text("email").notNull(),
// 	emailVerified: timestamp("emailVerified", { precision: 3, mode: 'string' }),
// 	password: text("password"),
// 	role: userRole("role").default('USER').notNull(),
// 	image: text("image"),
// 	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
// 	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
// },
// (table) => {
// 	return {
// 		emailKey: uniqueIndex("User_email_key").on(table.email),
// 	}
// });

// export const account = pgTable("Account", {
// 	id: text("id").primaryKey().notNull(),
// 	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
// 	type: text("type").notNull(),
// 	provider: text("provider").notNull(),
// 	providerAccountId: text("providerAccountId").notNull(),
// 	refreshToken: text("refresh_token"),
// 	accessToken: text("access_token"),
// 	expiresAt: integer("expires_at"),
// 	tokenType: text("token_type"),
// 	scope: text("scope"),
// 	idToken: text("id_token"),
// 	sessionState: text("session_state"),
// },
// (table) => {
// 	return {
// 		providerProviderAccountIdKey: uniqueIndex("Account_provider_providerAccountId_key").on(table.provider, table.providerAccountId),
// 	}
// });

// export const session = pgTable("Session", {
// 	id: text("id").primaryKey().notNull(),
// 	sessionToken: text("sessionToken").notNull(),
// 	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
// 	expires: timestamp("expires", { precision: 3, mode: 'string' }).notNull(),
// },
// (table) => {
// 	return {
// 		sessionTokenKey: uniqueIndex("Session_sessionToken_key").on(table.sessionToken),
// 	}
// });

// export const project = pgTable("Project", {
// 	id: text("id").primaryKey().notNull(),
// 	name: text("name").notNull(),
// 	label: text("label").notNull(),
// 	status: text("status").notNull(),
// 	description: text("description").notNull(),
// 	startDate: timestamp("start_date", { precision: 3, mode: 'string' }).notNull(),
// 	endDate: timestamp("end_date", { precision: 3, mode: 'string' }).notNull(),
// 	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
// 	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
// 	ownerId: text("ownerId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
// });

// export const member = pgTable("Member", {
// 	id: text("id").primaryKey().notNull(),
// 	projectId: text("projectId").notNull().references(() => project.id, { onDelete: "restrict", onUpdate: "cascade" } ),
// 	role: projectRole("role").default('MEMBER').notNull(),
// 	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
// 	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
// 	userId: text("userId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
// },
// (table) => {
// 	return {
// 		projectIdUserIdKey: uniqueIndex("Member_projectId_userId_key").on(table.projectId, table.userId),
// 	}
// });

// export const task = pgTable("Task", {
// 	id: text("id").primaryKey().notNull(),
// 	name: text("name").notNull(),
// 	label: text("label").notNull(),
// 	status: text("status").notNull(),
// 	priority: text("priority").notNull(),
// 	description: text("description").notNull(),
// 	dueDate: timestamp("due_date", { precision: 3, mode: 'string' }).notNull(),
// 	createdAt: timestamp("createdAt", { precision: 3, mode: 'string' }).defaultNow().notNull(),
// 	updatedAt: timestamp("updatedAt", { precision: 3, mode: 'string' }).notNull(),
// 	memberId: text("memberId").notNull().references(() => member.id, { onDelete: "restrict", onUpdate: "cascade" } ),
// 	projectId: text("projectId").notNull().references(() => project.id, { onDelete: "restrict", onUpdate: "cascade" } ),
// });
