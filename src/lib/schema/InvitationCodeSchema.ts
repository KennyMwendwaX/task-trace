import { z } from "zod";

export const invitationCodeSchema = z.object({
  code: z.string(),
  expiresAt: z.date().nullable(),
});

export type InvitationCode = z.infer<typeof invitationCodeSchema>;
