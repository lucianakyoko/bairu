import crypto from "node:crypto";

import { UsernameAvailabilityService } from "./username-availability.service.js";
import { PrismaService } from "../../../database/prisma.service.js";
import { CompanyService } from "../company.service.js";
import { CompanyPersonType } from "../enums/company-person-type.enum.js";
import { cleanDatabase } from "../../../test/database/clean-database.js";
import { createTestUser } from "../../../test/factories/user.factory.js";

describe("UsernameAvailabilityService", () => {
  let prisma: PrismaService;
  let service: UsernameAvailabilityService;
  let companyService: CompanyService;

  beforeEach(async () => {
    await cleanDatabase(prisma);
  });

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();

    service = new UsernameAvailabilityService(prisma);
    companyService = new CompanyService(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns AVAILABLE when username does not exist", async () => {
    const username = `available-${crypto.randomUUID().slice(0, 8)}`;

    const result = await service.resolve(username);

    expect(result).toEqual({
      status: "AVAILABLE",
    });
  });

  it("returns CURRENTLY_TAKEN when username is currently assigned to a company", async () => {
    const owner = await createTestUser(prisma);

    const username = `taken-${crypto.randomUUID().slice(0, 8)}`;

    await companyService.create(owner.id, {
      name: "Current Username Company",
      username,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const result = await service.resolve(username);

    expect(result).toEqual({
      status: "CURRENTLY_TAKEN",
    });
  });

  it("returns IN_COOLDOWN when username has an active historical cooldown", async () => {
    const owner = await createTestUser(prisma);

    const company = await companyService.create(owner.id, {
      name: "Cooldown Company",
      username: `cooldown-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const releasedAt = new Date();

    await prisma.companyUsernameHistory.create({
      data: {
        companyId: company.id,
        username: company.username,
        releasedAt,
        cooldownUntil: new Date(
          releasedAt.getTime() + 30 * 24 * 60 * 60 * 1000,
        ),
      },
    });

    await prisma.company.update({
      where: {
        id: company.id,
      },
      data: {
        username: `current-${crypto.randomUUID().slice(0, 8)}`,
      },
    });

    const result = await service.resolve(company.username);

    expect(result).toEqual({
      status: "IN_COOLDOWN",
    });
  });

  it("returns AVAILABLE when historical cooldown has expired", async () => {
    const owner = await createTestUser(prisma);

    const historicalUsername = `expired-${crypto.randomUUID().slice(0, 8)}`;
    const currentUsername = `current-${crypto.randomUUID().slice(0, 8)}`;

    const company = await companyService.create(owner.id, {
      name: "Expired Cooldown Company",
      username: currentUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const releasedAt = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);

    const cooldownUntil = new Date(Date.now() - 24 * 60 * 60 * 1000);

    await prisma.companyUsernameHistory.create({
      data: {
        companyId: company.id,
        username: historicalUsername,
        releasedAt,
        cooldownUntil,
      },
    });

    const result = await service.resolve(historicalUsername);

    expect(result).toEqual({
      status: "AVAILABLE",
    });
  });
});
