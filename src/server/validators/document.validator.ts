import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(200, "Title is too long."),

  content: z.string().optional(),

  workspaceId: z.string().cuid(),
});

export type CreateDocumentInput = z.infer<
  typeof createDocumentSchema>;