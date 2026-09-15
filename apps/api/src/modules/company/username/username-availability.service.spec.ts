import crypto from "node:crypto";
import { jest } from "@jest/globals";

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

  afterEach(() => {
    jest.useFakeTimers({
      doNotFake: [
        "setTimeout",
        "clearTimeout",
        "setInterval",
        "clearInterval",
        "setImmediate",
        "clearImmediate",
        "nextTick",
      ],
    });
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

    const historicalUsername = `cooldown-${crypto.randomUUID().slice(0, 8)}`;
    const currentUsername = `current-${crypto.randomUUID().slice(0, 8)}`;

    const company = await companyService.create(owner.id, {
      name: "Cooldown Company",
      username: currentUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const releasedAt = new Date();

    const cooldownUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

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

  it("returns AVAILABLE exactly when cooldown ends", async () => {
    const owner = await createTestUser(prisma);

    const historicalUsername = `boundary-${crypto.randomUUID().slice(0, 8)}`;
    const currentUsername = `current-${crypto.randomUUID().slice(0, 8)}`;

    const company = await companyService.create(owner.id, {
      name: "Boundary Cooldown Company",
      username: currentUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const cooldownUntil = new Date("2026-09-15T19:00:00.000Z");

    await prisma.companyUsernameHistory.create({
      data: {
        companyId: company.id,
        username: historicalUsername,
        releasedAt: new Date(
          cooldownUntil.getTime() - 30 * 24 * 60 * 60 * 1000,
        ),
        cooldownUntil,
      },
    });

    jest.useFakeTimers({
      doNotFake: [
        "setTimeout",
        "clearTimeout",
        "setInterval",
        "clearInterval",
        "setImmediate",
        "clearImmediate",
        "nextTick",
      ],
    });

    jest.setSystemTime(cooldownUntil);

    const result = await service.resolve(historicalUsername);

    expect(result).toEqual({
      status: "AVAILABLE",
    });
  });

  it("uses the most recent historical record when multiple histories exist", async () => {
    const owner = await createTestUser(prisma);

    const historicalUsername = `history-${crypto.randomUUID().slice(0, 8)}`;
    const currentUsername = `current-${crypto.randomUUID().slice(0, 8)}`;

    const company = await companyService.create(owner.id, {
      name: "Multiple Histories Company",
      username: currentUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const now = new Date();

    const olderReleasedAt = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000);

    const newerReleasedAt = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

    await prisma.companyUsernameHistory.createMany({
      data: [
        {
          companyId: company.id,
          username: historicalUsername,
          releasedAt: olderReleasedAt,
          cooldownUntil: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        },
        {
          companyId: company.id,
          username: historicalUsername,
          releasedAt: newerReleasedAt,
          cooldownUntil: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
      ],
    });

    const result = await service.resolve(historicalUsername);

    expect(result).toEqual({
      status: "AVAILABLE",
    });
  });
});
