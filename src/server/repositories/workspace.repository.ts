import { db } from "~/server/db";

import type { CreateWorkspaceInput } from "~/server/validators/workspace.validator";

export class WorkspaceRepository {
  async create(data: CreateWorkspaceInput) {
    return db.workspace.create({
      data: {
        name: data.name,
        description: data.description,
        organizationId: data.organizationId,
      },
    });
  }

  async findById(id: string) {
    return db.workspace.findUnique({
      where: {
        id,
      },
    });
  }

  async findByOrganization(organizationId: string) {
    return db.workspace.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findByOrganizationId(organizationId: string) {
  return db.workspace.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
}

export const workspaceRepository = new WorkspaceRepository();