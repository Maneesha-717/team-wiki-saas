import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { organizationRouter } from "~/server/api/routers/organization";

export const appRouter = createTRPCRouter({
  organization: organizationRouter,
});

// This is required by the latest T3 template
export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;