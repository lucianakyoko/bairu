import { PrismaClient } from "../../../src/generated/prisma/client.js";
import { PasswordService } from "../../../src/common/security/password.service.js";

export async function seedDevelopmentUser(prisma: PrismaClient) {
  const passwordService = new PasswordService();

  const password = "dev-password";
  const passwordHash = await passwordService.hash(password);

  const user = await prisma.user.upsert({
    where: {
      email: "dev@bairu.local",
    },
    update: {
      role: "USER",
      status: "ACTIVE",
    },
    create: {
      name: "Development User",
      email: "dev@bairu.local",
      passwordHash,
      role: "USER",
      status: "ACTIVE",
    },
  });

  console.log(`👤 Development user ready: ${user.id}`);

  const adminPassword = "admin-password";
  const adminPasswordHash = await passwordService.hash(adminPassword);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@bairu.local",
    },
    update: {
      role: "ADMIN",
      status: "ACTIVE",
    },
    create: {
      name: "Development Admin",
      email: "admin@bairu.local",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(`🛡️ Development admin ready: ${admin.id}`);

  return {
    user,
    admin,
  };
}
