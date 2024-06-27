import { z } from "zod";

export const projectSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2, { message: "Name must be greater than 2 characters long" })
    .max(50, { message: "Name must be less than 20 characters long" }),
  status: z.enum(["BUILDING", "LIVE"]),
  ownerId: z.string({
    required_error: "Owner is required",
    invalid_type_error: "Owner must be a string",
  }),
  description: z
    .string()
    .min(1, { message: "Description must be at least 1 character long" })
    .max(200, {
      message: "Description cannot be longer than 200 characters",
    }),
  createdAt: z.date(),
  owner: z.object({
    name: z.string(),
    email: z.string(),
  }),
});

// Omitted schema for client-side form validation
export const projectFormSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
  owner: true,
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
