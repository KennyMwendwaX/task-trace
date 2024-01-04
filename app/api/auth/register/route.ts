import prisma from "@/prisma/db";
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { userSchema } from "@/lib/schema/UserSchema";

export async function POST(request: Request) {
  const req = await request.json();
  const requestSchema = userSchema.omit({
    id: true,
    emailVerified: true,
    image: true,
    createdAt: true,
    tasks: true,
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
    const userExists = await prisma.user.findUnique({
      where: { email },
    });
    if (userExists)
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user an account
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
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
