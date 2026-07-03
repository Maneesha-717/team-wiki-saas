import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Organization name must be at least 3 characters")
    .max(100),

  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Slug can contain only lowercase letters, numbers, and hyphens")
    .min(3)
    .max(50),
});

export type CreateOrganizationInput =
  z.infer<typeof createOrganizationSchema>;