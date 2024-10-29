import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { signinSchema } from "./lib/schema/UserSchema";
import db from "./database/db";

export const authConfig: NextAuthConfig = {
  providers: [
    Google,
    Github,
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials) throw new Error("Credentials are required");
        const validation = signinSchema.safeParse(credentials);

        if (!validation.success) return null;

        const { email, password } = validation.data;

        const user = await db.query.users.findFirst({
          where: (user, { eq }) => eq(user.email, email),
        });

        if (!user) return null;

        const checkPassword =
          user.password && (await compare(password, user.password));

        if (checkPassword) return user;

        return null;
      },
    }),
  ],
};
