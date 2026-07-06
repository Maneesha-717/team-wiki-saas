import { TRPCError } from "@trpc/server";

import { documentRepository } from "~/server/repositories/document.repository";
import { workspaceRepository } from "~/server/repositories/workspace.repository";

import type { CreateDocumentInput } from "~/server/validators/document.validator";

export class DocumentService {
  async createDocument(
    data: CreateDocumentInput,
    createdById: string,
  ) {
    const workspace = await workspaceRepository.findById(
      data.workspaceId,
    );

    if (!workspace) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Workspace not found.",
      });
    }

    return documentRepository.create(data, createdById);
  }

  async getWorkspaceDocuments(workspaceId: string) {
    return documentRepository.findByWorkspace(workspaceId);
  }

  async getDocument(id: string) {
    const document = await documentRepository.findById(id);

    if (!document) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Document not found.",
      });
    }

    return document;
  }

  async updateDocument(
    id: string,
    data: {
      title?: string;
      content?: string;
      isPublished?: boolean;
    },
  ) {
    await this.getDocument(id);

    return documentRepository.update(id, data);
  }

  async deleteDocument(id: string) {
    await this.getDocument(id);

    return documentRepository.delete(id);
  }
}

export const documentService = new DocumentService();