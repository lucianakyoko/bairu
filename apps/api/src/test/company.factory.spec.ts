import { PrismaService } from "../database/prisma.service.js";
import { createTestCompany } from "./factories/company.factory.js";
import { createTestUser } from "./factories/user.factory.js";

describe("createTestCompany", () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates a company in the test database", async () => {
    const owner = await createTestUser(prisma);

    const company = await createTestCompany(prisma, {
      ownerUserId: owner.id,
    });

    expect(company.id).toBeDefined();
    expect(company.ownerUserId).toBe(owner.id);
    expect(company.username).toBeDefined();
    expect(company.name).toBe("Test Company");
    expect(company.personType).toBe("LEGAL_ENTITY");
    expect(company.status).toBe("ACTIVE");
  });
});
