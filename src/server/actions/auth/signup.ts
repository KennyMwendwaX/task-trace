"use server";

import db from "@/database/db";
import { users } from "@/database/schema";
import { signupSchema, SignupValues } from "@/lib/schema/UserSchema";
import * as bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const signUp = async (values: SignupValues) => {
  const validation = signupSchema.safeParse(values);

  if (!validation.success) {
    return {
      error: "Invalid request data",
    };
  }

  try {
    const { name, email, password } = validation.data;

    const userExists = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (userExists) {
      return {
        error: "Email already registered",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.insert(users).values({
      name: name,
      email: email,
      password: hashedPassword,
    });

    if (!user) {
      return {
        error: "Failed to register user",
      };
    }

    return {
      message: "User registered successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Server error, try again later",
    };
  }
};
