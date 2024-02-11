import { z } from "zod";
import { userSchema } from "./UserSchema";
import { taskSchema } from "./TaskSchema";

export const memberSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  userName: z.string(),
  role: z.enum(["MEMBER", "ADMIN"]),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: userSchema.omit({
    id: true,
    password: true,
    emailVerified: true,
    role: true,
    image: true,
    createdAt: true,
    updatedAt: true,
  }),
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
