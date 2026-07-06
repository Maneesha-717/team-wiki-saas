import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { organizationService } from "~/server/services/organization.service";
import { createOrganizationSchema } from "~/server/validators/organization.validator";

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createOrganizationSchema)
    .mutation(async ({ ctx, input }) => {
      return organizationService.createOrganization(
        input,
        ctx.session.user.id,
      );
    }),

  myOrganizations: protectedProcedure.query(async ({ ctx }) => {
    return organizationService.getUserOrganizations(
      ctx.session.user.id,
    );
  }),
});