import { z } from "zod";
import { projectSchema } from "./ProjectSchema";

export const membershipRequestSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  requesterName: z.string(),
  requesterId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  project: z.object({ projectSchema }),
});

export type MemberShipRequests = z.infer<typeof membershipRequestSchema>;
