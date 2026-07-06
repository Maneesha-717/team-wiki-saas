import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Workspace name must be at least 3 characters")
    .max(100),

  description: z
    .string()
    .trim()
    .max(300)
    .optional(),

  organizationId: z.string().cuid(),
});

export type CreateWorkspaceInput =
  z.infer<typeof createWorkspaceSchema>;