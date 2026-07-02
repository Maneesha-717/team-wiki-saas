import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(100),
        slug: z.string().min(3).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.organization.create({
        data: {
          name: input.name,
          slug: input.slug,
        },
      });
    }),
});