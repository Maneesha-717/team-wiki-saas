import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { organizationService } from "~/server/services/organization.service";
import { createOrganizationSchema } from "~/server/validators/organization.validator";

export const organizationRouter = createTRPCRouter({
  create: publicProcedure
    .input(createOrganizationSchema)
    .mutation(async ({ input }) => {
      return organizationService.createOrganization(input);
    }),
});