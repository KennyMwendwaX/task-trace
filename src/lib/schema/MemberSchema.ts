import { z } from "zod";
import { taskSchema } from "./TaskSchema";

export const memberSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z
    .object({
      name: z.string(),
      email: z.string(),
    })
    .nullable(),
  tasks: z.array(taskSchema),
});

export const memberFormSchema = memberSchema.omit({
  id: true,
  userName: true,
  createdAt: true,
  updatedAt: true,
  projectId: true,
  user: true,
  tasks: true,
});

export type Member = z.infer<typeof memberSchema>;
export type MemberFormValues = z.infer<typeof memberFormSchema>;
