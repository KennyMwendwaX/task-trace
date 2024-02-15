import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { userSchema } from "@/lib/schema/UserSchema";
import db from "@/db/db";
import { users } from "@/db/schema";

export async function POST(request: Request) {
  const req = await request.json();

  const requestSchema = userSchema.omit({
    id: true,
    role: true,
    emailVerified: true,
    image: true,
    createdAt: true,
    updatedAt: true,
  });

  const result = requestSchema.safeParse(req);

  if (!result.success)
    return NextResponse.json(
      { message: "Invalid request data" },
      { status: 400 }
    );

  const { name, email, password } = result.data;

  try {
    // Check if the email is already registered
    const userExists = await db.query.users.findFirst({
      where: (fields, operators) => operators.eq(fields.email, email),
    });

    if (userExists)
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user an account
    const user = await db.insert(users).values({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Return success message
    if (!user)
      return NextResponse.json(
        { message: "Failed to register user" },
        { status: 500 }
      );

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
