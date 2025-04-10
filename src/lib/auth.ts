import db from "@/database/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    generateId: false,
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
