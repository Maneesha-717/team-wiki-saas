import { TRPCError } from "@trpc/server";

import { organizationRepository } from "~/server/repositories/organization.repository";
import { workspaceRepository } from "~/server/repositories/workspace.repository";
import type { CreateWorkspaceInput } from "~/server/validators/workspace.validator";

export class WorkspaceService {
  async createWorkspace(data: CreateWorkspaceInput) {
    const organization = await organizationRepository.findById(
      data.organizationId,
    );

    if (!organization) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Organization not found.",
      });
    }

    return workspaceRepository.create(data);
  }

  async getOrganizationWorkspaces(organizationId: string) {
    return workspaceRepository.findByOrganizationId(organizationId);
  }
}

export const workspaceService = new WorkspaceService();