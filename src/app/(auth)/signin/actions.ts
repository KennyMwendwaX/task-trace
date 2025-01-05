"use server";

import { signIn, signOut } from "@/auth";
import { SigninValues, signinSchema } from "@/lib/schema/UserSchema";
import { DEFAULT_ROUTE_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const credentialsLogin = async (values: SigninValues) => {
  try {
    const validation = signinSchema.safeParse(values);
    if (!validation.success) return { error: "Invalid credentials" };
    const { email, password } = validation.data;
    await signIn("credentials", {
      email: email,
      password: password,
      redirectTo: DEFAULT_ROUTE_REDIRECT, // Do not redirect, so we can handle the result ourselves
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};

export const providerLogin = async (provider: "google" | "github") => {
  try {
    await signIn(provider);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "EmailSignInError":
          return { error: "Invalid email" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};

export const logout = async () => {
  await signOut();
};
