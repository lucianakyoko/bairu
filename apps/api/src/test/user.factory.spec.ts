import { PrismaService } from "../database/prisma.service.js";
import { createTestUser } from "./factories/user.factory.js";

describe("createTestUser", () => {
  const prisma = new PrismaService();

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates a user in the test database", async () => {
    const user = await createTestUser(prisma);

    expect(user.id).toBeDefined();
    expect(user.email).toContain("@bairu.test");
    expect(user.role).toBe("USER");
    expect(user.status).toBe("ACTIVE");
  });
});
