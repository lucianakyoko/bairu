import { ForbiddenException } from "@nestjs/common";
import { jest } from "@jest/globals";

import { PrismaService } from "../../../database/prisma.service.js";
import { CurrentUserService } from "../../auth/current-user/current-user.service.js";
import { UserRole } from "../../../modules/user/enums/user-role.enum.js";
import { UserStatus } from "../../../modules/user/enums/user-status.enum.js";
import { createTestUser } from "../../../test/factories/user.factory.js";
import { AdminGuard } from "./admin.guard.js";

describe("AdminGuard", () => {
  let prisma: PrismaService;
  let currentUserService: {
    getUserId: jest.Mock;
  };
  let guard: AdminGuard;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();

    currentUserService = {
      getUserId: jest.fn(),
    };

    guard = new AdminGuard(
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

  it("allows an active admin", async () => {
    const admin = await createTestUser(prisma);

    await prisma.user.update({
      where: {
        id: admin.id,
      },
      data: {
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
    });

    currentUserService.getUserId.mockReturnValue(admin.id);

    const result = await guard.canActivate();

    expect(result).toBe(true);
  });

  it("throws ForbiddenException for a regular user", async () => {
    const user = await createTestUser(prisma);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      },
    });

    currentUserService.getUserId.mockReturnValue(user.id);

    await expect(guard.canActivate()).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it("throws ForbiddenException for an inactive admin", async () => {
    const admin = await createTestUser(prisma);

    await prisma.user.update({
      where: {
        id: admin.id,
      },
      data: {
        role: UserRole.ADMIN,
        status: UserStatus.INACTIVE,
      },
    });

    currentUserService.getUserId.mockReturnValue(admin.id);

    await expect(guard.canActivate()).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
