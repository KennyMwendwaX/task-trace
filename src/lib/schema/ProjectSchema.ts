import { z } from "zod";
import { ProjectRole } from "../config";

export const projectSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2, { message: "Name must be greater than 2 characters long" })
    .max(50, { message: "Name must be less than 50 characters long" }),
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
  isPublic: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  owner: z.object({
    name: z.string(),
    email: z.string(),
  }),
});

// Omitted schema for client-side form validation
export const projectFormSchema = projectSchema.omit({
  id: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
  owner: true,
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type UserProject = Project & {
  memberRole: ProjectRole;
  totalTasksCount: number;
  completedTasksCount: number;
  memberCount: number;
};

export interface Member {
  id: string;
  role: string;
}
export type ExtendedProject = Project & {
  member: Member | null;
};
