import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { workspaceService } from "~/server/services/workspace.service";
import { createWorkspaceSchema } from "~/server/validators/workspace.validator";

export const workspaceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createWorkspaceSchema)
    .mutation(async ({ input }) => {
      return workspaceService.createWorkspace(input);
    }),

  getByOrganization: protectedProcedure
    .input(
      z.object({
        organizationId: z.string().cuid(),
      }),
    )
    .query(async ({ input }) => {
      return workspaceService.getOrganizationWorkspaces(
        input.organizationId,
      );
    }),
});