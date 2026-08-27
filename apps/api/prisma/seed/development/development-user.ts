import { PrismaClient } from "../../../src/generated/prisma/client.js";
import { PasswordService } from "../../../src/common/security/password.service.js";

export async function seedDevelopmentUser(prisma: PrismaClient) {
  const passwordService = new PasswordService();

  const email = "dev@bairu.local";
  const password = "dev-password";

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`👤 Development user already exists: ${existingUser.id}`);
    return existingUser;
  }

  const passwordHash = await passwordService.hash(password);

  const user = await prisma.user.create({
    data: {
      name: "Development User",
      email,
      passwordHash,
      role: "USER",
      status: "ACTIVE",
    },
  });

  console.log(`👤 Development user created: ${user.id}`);

  return user;
}
