import { TRPCError } from "@trpc/server";

import { organizationRepository } from "~/server/repositories/organization.repository";
import type { CreateOrganizationInput } from "~/server/validators/organization.validator";

export class OrganizationService {
  async createOrganization(data: CreateOrganizationInput) {
    const existingOrganization =
      await organizationRepository.findBySlug(data.slug);

    if (existingOrganization) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Organization slug already exists.",
      });
    }

    return organizationRepository.create(data);
  }
}

export const organizationService = new OrganizationService();