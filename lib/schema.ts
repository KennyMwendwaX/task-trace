import { z } from "zod";

export const taskSchema = z.object({
  name: z.string(),
  label: z.string(),
  priority: z.string(),
  status: z.string(),
  due_date: z.string(),
  assignedTo: z.string(),
  description: z.string(),
});

export type Task = z.infer<typeof taskSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
