import { db } from "~/server/db";

import type { CreateOrganizationInput } from "~/server/validators/organization.validator";

export class OrganizationRepository {
  async create(data: CreateOrganizationInput) {
    return db.organization.create({
      data,
    });
  }

  async findBySlug(slug: string) {
    return db.organization.findUnique({
      where: {
        slug,
      },
    });
  }

  async findById(id: string) {
    return db.organization.findUnique({
      where: {
        id,
      },
    });
  }
}

export const organizationRepository = new OrganizationRepository();