import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { organizationRouter } from "~/server/api/routers/organization";
import { workspaceRouter } from "~/server/api/routers/workspace";
import { documentRouter } from "~/server/api/routers/document";


export const appRouter = createTRPCRouter({
  organization: organizationRouter,
  workspace: workspaceRouter,
  document: documentRouter,
});

// This is required by the latest T3 template
export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;