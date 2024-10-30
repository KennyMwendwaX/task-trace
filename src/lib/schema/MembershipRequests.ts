import { z } from "zod";

export const userMembershipRequest = z.object({
  id: z.string(),
  projectId: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  requesterId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  project: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const projectMembershipRequest = z.object({
  id: z.string(),
  projectId: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  requesterId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.string().nullable(),
  }),
});

export type UserMembershipRequest = z.infer<typeof userMembershipRequest>;
export type ProjectMembershipRequest = z.infer<typeof projectMembershipRequest>;
