import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { userSchema, signupSchema } from "@/lib/schema/UserSchema";
import db from "@/database/db";
import { users } from "@/database/schema";

const requestSchema = userSchema.omit({
  id: true,
  emailVerified: true,
  image: true,
  createdAt: true,
  updatedAt: true,
});

export async function POST(request: Request) {
  try {
    const req = await request.json();

    const validation = requestSchema.safeParse(req);

    if (!validation.success)
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );

    const { name, email, password } = validation.data;

    const userExists = await db.query.users.findFirst({
      where: (userExists, { eq }) => eq(userExists.email, email),
    });

    if (userExists)
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.insert(users).values({
      name: name,
      email: email,
      password: hashedPassword,
    });

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
    console.log(error);
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
