import { db } from "~/server/db";

import type { CreateDocumentInput } from "~/server/validators/document.validator";

export class DocumentRepository {
  async create(data: CreateDocumentInput, createdById: string) {
    return db.document.create({
      data: {
        ...data,
        createdById,
      },
    });
  }

  async findById(id: string) {
    return db.document.findUnique({
      where: {
        id,
      },
    });
  }

  async findByWorkspace(workspaceId: string) {
    return db.document.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      content?: string;
      isPublished?: boolean;
    },
  ) {
    return db.document.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return db.document.delete({
      where: {
        id,
      },
    });
  }
}

export const documentRepository = new DocumentRepository();