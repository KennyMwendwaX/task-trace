import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import db from "./database/db";

export const authConfig: NextAuthConfig = {
  providers: [
    Google,
    Github,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credentials are required");
        }

        const { email, password } = credentials;

        const user = await db.query.users.findFirst({
          where: (user, { eq }) => eq(user.email, email as string),
        });

        if (!user) return null;

        const checkPassword =
          user.password && (await compare(password as string, user.password));

        if (checkPassword) return user;

        return null;
      },
    }),
  ],
};
