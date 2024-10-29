import { z } from "zod";

export const membershipRequestSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  requesterName: z.string(),
  requesterId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  project: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export type MembershipRequests = z.infer<typeof membershipRequestSchema>;
