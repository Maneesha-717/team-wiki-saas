import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { documentService } from "~/server/services/document.service";
import { createDocumentSchema } from "~/server/validators/document.validator";

export const documentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      return documentService.createDocument(
        input,
        ctx.session.user.id,
      );
    }),

  getByWorkspace: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().cuid(),
      }),
    )
    .query(async ({ input }) => {
      return documentService.getWorkspaceDocuments(
        input.workspaceId,
      );
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ input }) => {
      return documentService.getDocument(input.id);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        title: z.string().optional(),
        content: z.string().optional(),
        isPublished: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return documentService.updateDocument(id, data);
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ input }) => {
      return documentService.deleteDocument(input.id);
    }),
});