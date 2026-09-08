import { PrismaService } from "../../database/prisma.service.js";
import { createTestCompanyUsernameHistory } from "./company-username-history.factory.js";
import { createTestCompany } from "./company.factory.js";
import { createTestUser } from "./user.factory.js";

describe("createTestCompanyUsernameHistory", () => {
  const prisma = new PrismaService();

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates a company username history in the test database", async () => {
    const owner = await createTestUser(prisma);

    const company = await createTestCompany(prisma, {
      ownerUserId: owner.id,
    });

    const history = await createTestCompanyUsernameHistory(prisma, {
      companyId: company.id,
    });

    expect(history.id).toBeDefined();
    expect(history.companyId).toBe(company.id);
    expect(history.username).toBeDefined();
    expect(history.releasedAt).toBeInstanceOf(Date);
    expect(history.cooldownUntil).toBeInstanceOf(Date);
    expect(history.claimedByCompanyId).toBeNull();
    expect(history.claimedAt).toBeNull();
  });
});
