import { PrismaClient } from "../../src/generated/prisma/client.js";

export async function seedDevelopmentUser(prisma: PrismaClient) {
  await prisma.user.upsert({
    where: {
      email: "dev@bairu.local",
    },
    update: {},
    create: {
      name: "Bairu Development User",
      email: "dev@bairu.local",
      passwordHash: "NOT_A_REAL_PASSWORD",
      role: "USER",
      status: "ACTIVE",
    },
  });
}
