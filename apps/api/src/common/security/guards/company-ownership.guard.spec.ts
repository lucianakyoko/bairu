import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";
import { jest } from "@jest/globals";
import crypto from "node:crypto";

import { PrismaService } from "../../../database/prisma.service.js";
import { CurrentUserService } from "../../auth/current-user/current-user.service.js";
import { createTestUser } from "../../../test/factories/user.factory.js";
import { CompanyPersonType } from "../../../modules/company/enums/company-person-type.enum.js";
import { CompanyOwnershipGuard } from "./company-ownership.guard.js";

describe("CompanyOwnershipGuard", () => {
  let prisma: PrismaService;
  let currentUserService: {
    getUserId: jest.Mock;
  };
  let guard: CompanyOwnershipGuard;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();

    currentUserService = {
      getUserId: jest.fn(),
    };

    guard = new CompanyOwnershipGuard(
      prisma,
      currentUserService as unknown as CurrentUserService,
    );
  });

  beforeEach(async () => {
    await prisma.company.deleteMany();
    await prisma.user.deleteMany();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function createExecutionContext(companyId: string): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          params: {
            id: companyId,
          },
        }),
      }),
    } as ExecutionContext;
  }

  it("allows the company owner", async () => {
    const owner = await createTestUser(prisma);

    const company = await prisma.company.create({
      data: {
        ownerUserId: owner.id,
        name: "Owner Company",
        username: `owner-${crypto.randomUUID().slice(0, 8)}`,
        personType: CompanyPersonType.LEGAL_ENTITY,
      },
    });

    currentUserService.getUserId.mockReturnValue(owner.id);

    const result = await guard.canActivate(createExecutionContext(company.id));

    expect(result).toBe(true);
  });

  it("throws ForbiddenException when the user is not the company owner", async () => {
    const owner = await createTestUser(prisma);
    const otherUser = await createTestUser(prisma);

    const company = await prisma.company.create({
      data: {
        ownerUserId: owner.id,
        name: "Owner Company",
        username: `owner-${crypto.randomUUID().slice(0, 8)}`,
        personType: CompanyPersonType.LEGAL_ENTITY,
      },
    });

    currentUserService.getUserId.mockReturnValue(otherUser.id);

    await expect(
      guard.canActivate(createExecutionContext(company.id)),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("throws ForbiddenException when the company does not exist", async () => {
    const user = await createTestUser(prisma);
    const companyId = crypto.randomUUID();

    currentUserService.getUserId.mockReturnValue(user.id);

    await expect(
      guard.canActivate(createExecutionContext(companyId)),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("throws BadRequestException when the company id is invalid", async () => {
    const user = await createTestUser(prisma);

    currentUserService.getUserId.mockReturnValue(user.id);

    await expect(
      guard.canActivate(createExecutionContext("invalid-company-id")),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
