import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2, { message: "Name must be greater than 2 characters long" })
    .max(50, { message: "Name must be less than 20 characters long" }),
  label: z.enum(["FEATURE", "DOCUMENTATION", "BUG", "ERROR"], {
    required_error: "Label is required",
    invalid_type_error: "Label must be Feature, Documentation, Bug or Error",
  }),
  status: z.enum(["TO_DO", "IN_PROGRESS", "DONE", "CANCELED"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be Todo, In Progress, Done or Canceled",
  }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    required_error: "Priority is required",
    invalid_type_error: "Priority must be Low, Medium or High",
  }),
  dueDate: z.date({
    required_error: "Please select a date and time",
    invalid_type_error: "That's not a date!",
  }),
  projectId: z.string({
    required_error: "Project id is required",
    invalid_type_error: "Project id must be a string",
  }),
  memberId: z
    .string({
      required_error: "Member is required",
      invalid_type_error: "Member must be a string",
    })
    .nullable(),
  description: z
    .string()
    .min(1, { message: "Task description must be at least 1 character long" })
    .max(2000, {
      message: "Task description cannot be longer than 2000 characters",
    })
    .trim(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  member: z.object({
    user: z.object({
      name: z.string(),
      email: z.string(),
    }),
    role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
  }),
});

export const userTaskSchema = taskSchema.omit({
  member: true,
});

export const taskFormSchema = taskSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  projectId: true,
  member: true,
});

export type ProjectTask = z.infer<typeof taskSchema>;
export type UserTask = z.infer<typeof userTaskSchema>;
export type TaskFormValues = z.infer<typeof taskFormSchema>;
