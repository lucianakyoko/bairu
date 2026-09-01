import { PrismaClient } from "../../generated/prisma/client.js";

type CreateTestUserOverrides = {
  name?: string;
  email?: string;
  passwordHash?: string;
  phone?: string | null;
  role?: "USER" | "ADMIN";
  status?: "ACTIVE" | "INACTIVE";
};

export async function createTestUser(
  prisma: PrismaClient,
  overrides: CreateTestUserOverrides = {},
) {
  return prisma.user.create({
    data: {
      name: overrides.name ?? "Test User",
      email: overrides.email ?? `test-${crypto.randomUUID()}@bairu.test`,
      passwordHash: overrides.passwordHash ?? "test-password-hash",
      phone: overrides.phone ?? null,
      role: overrides.role ?? "USER",
      status: overrides.status ?? "ACTIVE",
    },
  });
}
