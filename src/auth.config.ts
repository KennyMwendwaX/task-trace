import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { signinSchema } from "./lib/schema/UserSchema";
import db from "./database/db";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Check if credentials are present
        if (!credentials) throw new Error("Credentials are required");

        const validation = signinSchema.safeParse(credentials);

        if (validation.success) {
          const { email, password } = validation.data;

          // Check user exists
          const user = await db.query.users.findFirst({
            where: (user, { eq }) => eq(user.email, email),
          });

          if (!user) return null;

          // Check password
          const checkPassword =
            user.password && (await compare(password, user.password));

          if (checkPassword) return user;
        }

        return null;
      },
    }),
  ],
};
