import { PrismaClient } from "../../generated/prisma/client.js";

interface CreateTestCompanyOptions {
  ownerUserId: string;
  username?: string;
  name?: string;
  personType?: "INDIVIDUAL" | "LEGAL_ENTITY";
  description?: string;
  document?: string;
  phone?: string;
  email?: string;
}

export async function createTestCompany(
  prisma: PrismaClient,
  options: CreateTestCompanyOptions,
) {
  const username =
    options.username ?? `testcompany_${crypto.randomUUID().slice(0, 8)}`;

  return prisma.company.create({
    data: {
      ownerUserId: options.ownerUserId,
      username,
      personType: options.personType ?? "LEGAL_ENTITY",
      name: options.name ?? "Test Company",
      description: options.description ?? null,
      document: options.document ?? null,
      phone: options.phone ?? null,
      email: options.email ?? null,
    },
  });
}
