import { z } from "zod";
import { userTaskSchema } from "./TaskSchema";

export const memberSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  user: z.object({
    name: z.string(),
    email: z.string(),
    image: z.string().nullable(),
  }),
});

export const memberFormSchema = memberSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  projectId: true,
  user: true,
});

export type Member = z.infer<typeof memberSchema>;
export type MemberFormValues = z.infer<typeof memberFormSchema>;
