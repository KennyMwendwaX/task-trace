import { taskFormSchema } from "@/lib/schema/TaskSchema";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany();
    if (tasks.length === 0)
      return NextResponse.json({ message: "No tasks found" }, { status: 404 });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error, Try again later" },
      { status: 500 }
    );
  }
}

// export async function POST(request: Request) {
//   const req = await request.json();

//   // Convert 'due_date' string to a Date object
//   const requestData = {
//     ...req,
//     due_date: new Date(req.due_date),
//   };

//   // Apply Zod schema to validate and parse the request data
//   const result = taskFormSchema.safeParse(requestData);

//   if (!result.success)
//     return NextResponse.json(
//       { message: "Invalid request data" },
//       { status: 400 }
//     );

//   const { name, label, priority, due_date, description } = result.data;

//   try {
//     const task = await prisma.task.create({
//       data: {
//         name,
//         label,
//         priority,
//         due_date,
//         description,
//         status: "TO_DO",
//       },
//     });

//     if (!task)
//       return NextResponse.json(
//         { message: "Failed to create task" },
//         { status: 500 }
//       );

//     return NextResponse.json(
//       { message: "Task created successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Server error, try again later" },
//       { status: 500 }
//     );
//   }
// }
