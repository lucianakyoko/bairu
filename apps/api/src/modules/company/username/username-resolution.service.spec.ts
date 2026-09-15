import crypto from "node:crypto";

import { PrismaService } from "../../../database/prisma.service.js";
import { CompanyService } from "../company.service.js";
import { CompanyPersonType } from "../enums/company-person-type.enum.js";
import { cleanDatabase } from "../../../test/database/clean-database.js";
import { createTestUser } from "../../../test/factories/user.factory.js";
import { UsernameResolutionService } from "./username-resolution.service.js";

describe("UsernameResolutionService", () => {
  let prisma: PrismaService;
  let service: UsernameResolutionService;
  let companyService: CompanyService;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();

    service = new UsernameResolutionService(prisma);
    companyService = new CompanyService(prisma);
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns the company when username is currently assigned", async () => {
    const owner = await createTestUser(prisma);

    const username = `current-${crypto.randomUUID().slice(0, 8)}`;

    const company = await companyService.create(owner.id, {
      name: "Current Username Company",
      username,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const result = await service.resolve(username);

    expect(result?.id).toBe(company.id);
    expect(result?.username).toBe(username);
  });

  it("normalizes username before querying", async () => {
    const owner = await createTestUser(prisma);

    const username = `normalized-${crypto.randomUUID().slice(0, 8)}`;

    const company = await companyService.create(owner.id, {
      name: "Normalized Username Company",
      username,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const result = await service.resolve(username.toUpperCase());

    expect(result?.id).toBe(company.id);
  });

  it("returns null when username is not currently assigned", async () => {
    const username = `missing-${crypto.randomUUID().slice(0, 8)}`;

    const result = await service.resolve(username);

    expect(result).toBeNull();
  });
});
