import { z } from "zod";
import { taskSchema } from "./TaskSchema";

export const userSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(5, { message: "Name must be greater than 5 characters long" })
    .max(20, { message: "Name must be less than 20 characters long" }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email address")
    .min(1, { message: "Required" }),
  emailVerified: z.date().nullable(),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, { message: "Password must be greater than 8 characters long" })
    .refine((value) => !/\s/.test(value), "Invalid Password"),
  image: z.string().nullable(),
  createdAt: z.date(),
  tasks: z.array(
    z.object({
      id: z.string(),
      name: z
        .string({
          required_error: "Name is required",
          invalid_type_error: "Name must be a string",
        })
        .min(2, { message: "Name must be greater than 2 characters long" })
        .max(50, { message: "Name must be less than 50 characters long" }),
      label: z
        .string({
          required_error: "Label is required",
          invalid_type_error: "Label must be a string",
        })
        .min(2, { message: "Label must be greater than 2 characters long" })
        .max(10, { message: "Label must be less than 10 characters long" }),
      status: z.enum(["TO_DO", "IN_PROGRESS", "DONE", "CANCELED"]),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
        required_error: "Priority is required",
        invalid_type_error: "Priority must be Low, Medium, or High",
      }),
      due_date: z.date({
        required_error: "Please select a date and time",
        invalid_type_error: "That's not a date!",
      }),
      userId: z.string({
        required_error: "User is required",
        invalid_type_error: "User must be a string",
      }),
      description: z
        .string({
          required_error: "Description is required",
          invalid_type_error: "Description must be a string",
        })
        .min(1, {
          message: "Task description must be at least 1 character long",
        })
        .max(200, {
          message: "Task description cannot be longer than 200 characters",
        }),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
});

export const signupFormSchema = userSchema
  .omit({
    id: true,
    emailVerified: true,
    image: true,
    createdAt: true,
    tasks: true,
  })
  .extend({
    confirm_password: z.string({
      required_error: "Password confirmation is required",
      invalid_type_error: "Password confirmation must be a string",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const signinFormSchema = userSchema.omit({
  id: true,
  name: true,
  emailVerified: true,
  image: true,
  createdAt: true,
  tasks: true,
});

export type User = z.infer<typeof userSchema>;
