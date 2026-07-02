import { createTRPCRouter } from "~/server/api/trpc";
import { organizationRouter } from "~/server/api/routers/organization";

export const appRouter = createTRPCRouter({
  organization: organizationRouter,
});

export type AppRouter = typeof appRouter;