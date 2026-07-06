import { OrganizationRole } from "../../../generated/prisma";
import { db } from "~/server/db";

import type { CreateOrganizationInput } from "~/server/validators/organization.validator";

export class OrganizationRepository {
  async create(data: CreateOrganizationInput, userId: string) {
    return db.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: data.name,
          slug: data.slug,
        },
      });

      await tx.organizationMember.create({
        data: {
          organizationId: organization.id,
          userId,
          role: OrganizationRole.OWNER,
        },
      });

      return organization;
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

  async findByUserId(userId: string) {
  return db.organization.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}


}

export const organizationRepository = new OrganizationRepository();