import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/database/db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
