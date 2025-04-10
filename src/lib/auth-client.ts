import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL as string,
});

export const { signUp, signIn, signOut, useSession } = authClient;
