import prisma from "@/prisma/db";
import { NextResponse } from "next/server";
import { projectFormSchema } from "@/lib/schema/ProjectSchema";

export async function GET() {
  try {
    const projects = await prisma.project.findMany();

    if (projects.length === 0)
      return NextResponse.json(
        { message: "No projects found" },
        { status: 404 }
      );

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const req = await request.json();

  const requestData = {
    ...req,
    start_date: new Date(req.start_date),
    end_date: new Date(req.end_date),
  };

  const result = projectFormSchema.safeParse(requestData);

  if (!result.success)
    return NextResponse.json(
      { message: "Invalid request data" },
      { status: 400 }
    );

  const { name, label, start_date, end_date, description } = result.data;

  try {
    const project = await prisma.project.create({
      data: {
        name,
        label,
        start_date,
        end_date,
        description,
        status: "TO_DO",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, try again later" },
      { status: 500 }
    );
  }
}
