import { CompanyService } from "./company.service.js";
import { PrismaService } from "../../database/prisma.service.js";
import { createTestUser } from "../../test/factories/user.factory.js";
import { CompanyPersonType } from "./enums/company-person-type.enum.js";
import { CreateCompanyDto } from "./dto/create-company.dto.js";
import { ErrorCode } from "../../common/errors/error-codes.js";
import { HttpStatus } from "@nestjs/common";
import { cleanDatabase } from "../../test/database/clean-database.js";
import {
  USERNAME_CHANGE_RATE_LIMIT_DAYS,
  USERNAME_HISTORY_COOLDOWN_DAYS,
} from "./company.constants.js";
import { AppException } from "../../common/errors/app.exception.js";

describe("CompanyService", () => {
  let prisma: PrismaService;
  let service: CompanyService;

  beforeEach(async () => {
    await cleanDatabase(prisma);
  });

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();

    service = new CompanyService(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates a company for the given owner", async () => {
    const owner = await createTestUser(prisma);

    const dto: CreateCompanyDto = {
      name: "Test Company Service",
      username: `test-company-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    };

    const company = await service.create(owner.id, dto);

    expect(company.id).toBeDefined();
    expect(company.ownerUserId).toBe(owner.id);
    expect(company.name).toBe(dto.name);
    expect(company.username).toBe(dto.username);
    expect(company.personType).toBe(dto.personType);
    expect(company.status).toBe("ACTIVE");
  });

  it("throws COMPANY_USERNAME_ALREADY_IN_USE when username is already taken", async () => {
    const owner = await createTestUser(prisma);
    const username = `test-company-${crypto.randomUUID().slice(0, 8)}`;

    await service.create(owner.id, {
      name: "First Company",
      username,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    await expect(
      service.create(owner.id, {
        name: "Second Company",
        username,
        personType: CompanyPersonType.LEGAL_ENTITY,
      }),
    ).rejects.toMatchObject({
      response: {
        error: {
          code: ErrorCode.COMPANY_USERNAME_ALREADY_IN_USE,
          message: "Username is already in use.",
        },
      },
      status: HttpStatus.CONFLICT,
    });
  });

  it("returns the company when it exists", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Find Company",
      username: `find-company-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const result = await service.findById(company.id);

    expect(result.id).toBe(company.id);
    expect(result.ownerUserId).toBe(owner.id);
    expect(result.name).toBe("Find Company");
    expect(result.username).toBe(company.username);
  });

  it("throws COMPANY_NOT_FOUND when the company does not exist", async () => {
    const companyId = crypto.randomUUID();

    await expect(service.findById(companyId)).rejects.toMatchObject({
      response: {
        error: {
          code: ErrorCode.COMPANY_NOT_FOUND,
          message: "Company not found.",
        },
      },
      status: HttpStatus.NOT_FOUND,
    });
  });

  it("updates the company when the owner provides valid data", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Original Company",
      username: `update-company-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const result = await service.update(company.id, owner.id, {
      name: "Updated Company",
      description: "Updated company description",
      phone: "15999999999",
      email: "updated@company.test",
    });

    expect(result.id).toBe(company.id);
    expect(result.ownerUserId).toBe(owner.id);
    expect(result.name).toBe("Updated Company");
    expect(result.username).toBe(company.username);
    expect(result.description).toBe("Updated company description");
    expect(result.phone).toBe("15999999999");
    expect(result.email).toBe("updated@company.test");
  });

  it("throws COMPANY_NOT_FOUND when the company does not belong to the owner", async () => {
    const owner = await createTestUser(prisma);
    const otherUser = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Owner Company",
      username: `owner-company-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    await expect(
      service.update(company.id, otherUser.id, {
        name: "Unauthorized Update",
      }),
    ).rejects.toMatchObject({
      response: {
        error: {
          code: ErrorCode.COMPANY_NOT_FOUND,
          message: "Company not found.",
        },
      },
      status: HttpStatus.NOT_FOUND,
    });
  });

  it("throws COMPANY_NOT_FOUND when the company does not exist", async () => {
    const owner = await createTestUser(prisma);
    const companyId = crypto.randomUUID();

    await expect(
      service.update(companyId, owner.id, {
        name: "Updated Company",
      }),
    ).rejects.toMatchObject({
      response: {
        error: {
          code: ErrorCode.COMPANY_NOT_FOUND,
          message: "Company not found.",
        },
      },
      status: HttpStatus.NOT_FOUND,
    });
  });

  it("deactivates an active company", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Active Company",
      username: `active-company-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const result = await service.deactivate(company.id, owner.id);

    expect(result.id).toBe(company.id);
    expect(result.status).toBe("INACTIVE");
  });

  it.each(["INACTIVE", "SUSPENDED", "ARCHIVED"] as const)(
    "throws COMPANY_INVALID_STATUS_TRANSITION when deactivating a %s company",
    async (status) => {
      const owner = await createTestUser(prisma);

      const company = await service.create(owner.id, {
        name: "Company",
        username: `deactivate-invalid-${crypto.randomUUID().slice(0, 8)}`,
        personType: CompanyPersonType.LEGAL_ENTITY,
      });

      await prisma.company.update({
        where: {
          id: company.id,
        },
        data: {
          status,
        },
      });

      await expect(
        service.deactivate(company.id, owner.id),
      ).rejects.toMatchObject({
        response: {
          error: {
            code: ErrorCode.COMPANY_INVALID_STATUS_TRANSITION,
            message: "Company cannot be deactivated from its current status.",
          },
        },
        status: HttpStatus.CONFLICT,
      });
    },
  );

  it("reactivates an inactive company", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Inactive Company",
      username: `inactive-company-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    await service.deactivate(company.id, owner.id);

    const result = await service.reactivate(company.id, owner.id);

    expect(result.id).toBe(company.id);
    expect(result.status).toBe("ACTIVE");
  });

  it.each(["ACTIVE", "SUSPENDED", "ARCHIVED"] as const)(
    "throws COMPANY_INVALID_STATUS_TRANSITION when reactivating a %s company",
    async (status) => {
      const owner = await createTestUser(prisma);

      const company = await service.create(owner.id, {
        name: "Company",
        username: `reactivate-invalid-${crypto.randomUUID().slice(0, 8)}`,
        personType: CompanyPersonType.LEGAL_ENTITY,
      });

      await prisma.company.update({
        where: {
          id: company.id,
        },
        data: {
          status,
        },
      });

      await expect(
        service.reactivate(company.id, owner.id),
      ).rejects.toMatchObject({
        response: {
          error: {
            code: ErrorCode.COMPANY_INVALID_STATUS_TRANSITION,
            message: "Company cannot be reactivated from its current status.",
          },
        },
        status: HttpStatus.CONFLICT,
      });
    },
  );

  it("archives an active company", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Active Company",
      username: `archive-active-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const result = await service.archive(company.id, owner.id);

    expect(result.id).toBe(company.id);
    expect(result.status).toBe("ARCHIVED");
  });

  it("archives an inactive company", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Inactive Company",
      username: `archive-inactive-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    await service.deactivate(company.id, owner.id);

    const result = await service.archive(company.id, owner.id);

    expect(result.id).toBe(company.id);
    expect(result.status).toBe("ARCHIVED");
  });

  it.each(["SUSPENDED", "ARCHIVED"] as const)(
    "throws COMPANY_INVALID_STATUS_TRANSITION when archiving a %s company",
    async (status) => {
      const owner = await createTestUser(prisma);

      const company = await service.create(owner.id, {
        name: "Company",
        username: `archive-invalid-${crypto.randomUUID().slice(0, 8)}`,
        personType: CompanyPersonType.LEGAL_ENTITY,
      });

      await prisma.company.update({
        where: {
          id: company.id,
        },
        data: {
          status,
        },
      });

      await expect(service.archive(company.id, owner.id)).rejects.toMatchObject(
        {
          response: {
            error: {
              code: ErrorCode.COMPANY_INVALID_STATUS_TRANSITION,
              message: "Company cannot be archived from its current status.",
            },
          },
          status: HttpStatus.CONFLICT,
        },
      );
    },
  );

  it("suspends an active company", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Active Company",
      username: `suspend-active-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const result = await service.suspend(company.id);

    expect(result.id).toBe(company.id);
    expect(result.status).toBe("SUSPENDED");
  });

  it("suspends an inactive company", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Inactive Company",
      username: `suspend-inactive-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    await service.deactivate(company.id, owner.id);

    const result = await service.suspend(company.id);

    expect(result.id).toBe(company.id);
    expect(result.status).toBe("SUSPENDED");
  });

  it.each(["SUSPENDED", "ARCHIVED"] as const)(
    "throws COMPANY_INVALID_STATUS_TRANSITION when suspending a %s company",
    async (status) => {
      const owner = await createTestUser(prisma);

      const company = await service.create(owner.id, {
        name: "Company",
        username: `suspend-invalid-${crypto.randomUUID().slice(0, 8)}`,
        personType: CompanyPersonType.LEGAL_ENTITY,
      });

      await prisma.company.update({
        where: { id: company.id },
        data: { status },
      });

      await expect(service.suspend(company.id)).rejects.toMatchObject({
        response: {
          error: {
            code: ErrorCode.COMPANY_INVALID_STATUS_TRANSITION,
            message: "Company cannot be suspended from its current status.",
          },
        },
        status: HttpStatus.CONFLICT,
      });
    },
  );

  it("restores a suspended company", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Company",
      username: `restore-suspended-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    await service.suspend(company.id);

    const result = await service.restore(company.id);

    expect(result.id).toBe(company.id);
    expect(result.status).toBe("ACTIVE");
  });

  it("restores an archived company", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Company",
      username: `restore-archived-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    await service.archive(company.id, owner.id);

    const result = await service.restore(company.id);

    expect(result.id).toBe(company.id);
    expect(result.status).toBe("ACTIVE");
  });

  it.each(["ACTIVE", "INACTIVE"] as const)(
    "throws COMPANY_INVALID_STATUS_TRANSITION when restoring a %s company",
    async (status) => {
      const owner = await createTestUser(prisma);

      const company = await service.create(owner.id, {
        name: "Company",
        username: `restore-invalid-${crypto.randomUUID().slice(0, 8)}`,
        personType: CompanyPersonType.LEGAL_ENTITY,
      });

      await prisma.company.update({
        where: { id: company.id },
        data: { status },
      });

      await expect(service.restore(company.id)).rejects.toMatchObject({
        response: {
          error: {
            code: ErrorCode.COMPANY_INVALID_STATUS_TRANSITION,
            message: "Company cannot be restored from its current status.",
          },
        },
        status: HttpStatus.CONFLICT,
      });
    },
  );

  it("changes the company username through the dedicated operation", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Username Change Company",
      username: `old-username-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const newUsername = `new-username-${crypto.randomUUID().slice(0, 8)}`;

    const result = await service.changeUsername(company.id, owner.id, {
      username: newUsername,
    });

    expect(result.id).toBe(company.id);
    expect(result.ownerUserId).toBe(owner.id);
    expect(result.username).toBe(newUsername);
  });

  it.each(["INACTIVE", "SUSPENDED", "ARCHIVED"] as const)(
    "throws COMPANY_USERNAME_CHANGE_NOT_ALLOWED when changing username for a %s company",
    async (status) => {
      const owner = await createTestUser(prisma);

      const company = await service.create(owner.id, {
        name: "Company",
        username: `username-status-${crypto.randomUUID().slice(0, 8)}`,
        personType: CompanyPersonType.LEGAL_ENTITY,
      });

      await prisma.company.update({
        where: {
          id: company.id,
        },
        data: {
          status,
        },
      });

      await expect(
        service.changeUsername(company.id, owner.id, {
          username: `new-username-${crypto.randomUUID().slice(0, 8)}`,
        }),
      ).rejects.toMatchObject({
        response: {
          error: {
            code: ErrorCode.COMPANY_USERNAME_CHANGE_NOT_ALLOWED,
            message: "Company must be active to change its username.",
          },
        },
        status: HttpStatus.CONFLICT,
      });
    },
  );

  it("persists the normalized username", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Username Normalization Company",
      username: `old-username-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const result = await service.changeUsername(company.id, owner.id, {
      username: "Bairu_123",
    });

    expect(result.username).toBe("bairu_123");

    const persistedCompany = await prisma.company.findUniqueOrThrow({
      where: {
        id: company.id,
      },
    });

    expect(persistedCompany.username).toBe("bairu_123");
  });

  it("rejects changing to the current username", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Same Username Company",
      username: `same-username-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    await expect(
      service.changeUsername(company.id, owner.id, {
        username: company.username,
      }),
    ).rejects.toMatchObject({
      response: {
        error: {
          code: ErrorCode.COMPANY_USERNAME_UNCHANGED,
          message:
            "The new username must be different from the current username.",
        },
      },
      status: HttpStatus.CONFLICT,
    });
  });

  it("rejects changing to the current username with different casing", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Case Username Company",
      username: `case-username-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    await expect(
      service.changeUsername(company.id, owner.id, {
        username: company.username.toUpperCase(),
      }),
    ).rejects.toMatchObject({
      response: {
        error: {
          code: ErrorCode.COMPANY_USERNAME_UNCHANGED,
        },
      },
      status: HttpStatus.CONFLICT,
    });
  });

  it("rejects username changes within the 7-day rate limit window", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Rate Limited Company",
      username: `rate-limit-${crypto.randomUUID().slice(0, 8)}`,
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

    await expect(
      service.changeUsername(company.id, owner.id, {
        username: `new-username-${crypto.randomUUID().slice(0, 8)}`,
      }),
    ).rejects.toMatchObject({
      response: {
        error: {
          code: ErrorCode.COMPANY_USERNAME_CHANGE_RATE_LIMITED,
          message: "Company username can only be changed once every 7 days.",
        },
      },
      status: HttpStatus.TOO_MANY_REQUESTS,
    });
  });

  it("allows username changes after the 7-day rate limit window", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Rate Limit Expired Company",
      username: `rate-expired-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const releasedAt = new Date(
      Date.now() - (USERNAME_CHANGE_RATE_LIMIT_DAYS + 1) * 24 * 60 * 60 * 1000,
    );

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

    const newUsername = `new-username-${crypto.randomUUID().slice(0, 8)}`;
    const result = await service.changeUsername(company.id, owner.id, {
      username: newUsername,
    });

    expect(result.username).toBe(newUsername);
  });

  it("creates username history when changing username", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "History Company",
      username: `history-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const previousUsername = company.username;
    const newUsername = `updated-${crypto.randomUUID().slice(0, 8)}`;

    const beforeChange = new Date();

    await service.changeUsername(company.id, owner.id, {
      username: newUsername,
    });

    const afterChange = new Date();

    const history = await prisma.companyUsernameHistory.findFirst({
      where: {
        companyId: company.id,
        username: previousUsername,
      },
    });

    expect(history).not.toBeNull();
    expect(history?.companyId).toBe(company.id);
    expect(history?.username).toBe(previousUsername);
    expect(history?.releasedAt.getTime()).toBeGreaterThanOrEqual(
      beforeChange.getTime(),
    );
    expect(history?.releasedAt.getTime()).toBeLessThanOrEqual(
      afterChange.getTime(),
    );
    expect(history?.cooldownUntil.getTime()).toBe(
      history!.releasedAt.getTime() +
        USERNAME_HISTORY_COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
    );
    expect(history?.claimedByCompanyId).toBeNull();
    expect(history?.claimedAt).toBeNull();

    const updatedCompany = await prisma.company.findUniqueOrThrow({
      where: { id: company.id },
    });

    expect(updatedCompany.username).toBe(newUsername);
  });

  it("throws a domain error when the new username is already in use", async () => {
    const owner = await createTestUser(prisma);
    const otherOwner = await createTestUser(prisma);

    const existingCompany = await service.create(otherOwner.id, {
      name: "Existing Company",
      username: `existing-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const company = await service.create(owner.id, {
      name: "Company",
      username: `company-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    try {
      await service.changeUsername(company.id, owner.id, {
        username: existingCompany.username,
      });

      throw new Error("Expected username conflict to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);

      const response = (error as AppException).getResponse();

      expect(response).toEqual({
        error: {
          code: ErrorCode.COMPANY_USERNAME_ALREADY_IN_USE,
          message: "Username is already in use.",
        },
      });

      expect((error as AppException).getStatus()).toBe(HttpStatus.CONFLICT);
    }

    const unchangedCompany = await prisma.company.findUniqueOrThrow({
      where: {
        id: company.id,
      },
    });

    expect(unchangedCompany.username).toBe(company.username);

    const history = await prisma.companyUsernameHistory.findMany({
      where: {
        companyId: company.id,
      },
    });

    expect(history).toHaveLength(0);
  });

  it("normalizes the username before persisting it", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Company",
      username: `company-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const requestedUsername = `NEW-USERNAME-${crypto.randomUUID().slice(0, 8)}`;
    const expectedUsername = requestedUsername.toLowerCase();

    const updatedCompany = await service.changeUsername(company.id, owner.id, {
      username: requestedUsername,
    });

    expect(updatedCompany.username).toBe(expectedUsername);

    const persistedCompany = await prisma.company.findUniqueOrThrow({
      where: {
        id: company.id,
      },
    });

    expect(persistedCompany.username).toBe(expectedUsername);
  });

  it("keeps the company unchanged when username recovery fails", async () => {
    const owner = await createTestUser(prisma);

    const company = await service.create(owner.id, {
      name: "Recovery Transaction Company",
      username: `recovery-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const originalUsername = company.username;

    await expect(
      service.recoverUsername(company.id, "username-that-does-not-exist"),
    ).rejects.toMatchObject({
      response: {
        error: {
          code: ErrorCode.COMPANY_USERNAME_HISTORY_NOT_RECOVERABLE,
          message: "Username history cannot be recovered.",
        },
      },
      status: HttpStatus.CONFLICT,
    });

    const unchangedCompany = await prisma.company.findUniqueOrThrow({
      where: {
        id: company.id,
      },
    });

    expect(unchangedCompany.username).toBe(originalUsername);
  });

  it("recovers a username during the cooldown period", async () => {
    const owner = await createTestUser(prisma);

    const currentUsername = `current-${crypto.randomUUID().slice(0, 8)}`;
    const previousUsername = `previous-${crypto.randomUUID().slice(0, 8)}`;

    const company = await service.create(owner.id, {
      name: "Recovery During Cooldown Company",
      username: currentUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const releasedAt = new Date();
    const cooldownUntil = new Date(
      releasedAt.getTime() +
        USERNAME_HISTORY_COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
    );

    await prisma.companyUsernameHistory.create({
      data: {
        companyId: company.id,
        username: previousUsername,
        releasedAt,
        cooldownUntil,
      },
    });

    const result = await service.recoverUsername(company.id, previousUsername);

    expect(result.username).toBe(previousUsername);

    const persistedCompany = await prisma.company.findUniqueOrThrow({
      where: {
        id: company.id,
      },
    });

    expect(persistedCompany.username).toBe(previousUsername);
  });

  it("recovers a username after the cooldown period", async () => {
    const owner = await createTestUser(prisma);

    const currentUsername = `current-${crypto.randomUUID().slice(0, 8)}`;
    const previousUsername = `previous-${crypto.randomUUID().slice(0, 8)}`;

    const company = await service.create(owner.id, {
      name: "Recovery After Cooldown Company",
      username: currentUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const releasedAt = new Date(
      Date.now() - (USERNAME_HISTORY_COOLDOWN_DAYS + 1) * 24 * 60 * 60 * 1000,
    );

    const cooldownUntil = new Date(
      releasedAt.getTime() +
        USERNAME_HISTORY_COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
    );

    await prisma.companyUsernameHistory.create({
      data: {
        companyId: company.id,
        username: previousUsername,
        releasedAt,
        cooldownUntil,
      },
    });

    const result = await service.recoverUsername(company.id, previousUsername);

    expect(result.username).toBe(previousUsername);
  });

  it("does not create additional username history when recovering", async () => {
    const owner = await createTestUser(prisma);

    const currentUsername = `current-${crypto.randomUUID().slice(0, 8)}`;
    const previousUsername = `previous-${crypto.randomUUID().slice(0, 8)}`;

    const company = await service.create(owner.id, {
      name: "Recovery History Company",
      username: currentUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    await prisma.companyUsernameHistory.create({
      data: {
        companyId: company.id,
        username: previousUsername,
        releasedAt: new Date(),
        cooldownUntil: new Date(
          Date.now() + USERNAME_HISTORY_COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
        ),
      },
    });

    const historyBefore = await prisma.companyUsernameHistory.findMany({
      where: {
        companyId: company.id,
      },
    });

    await service.recoverUsername(company.id, previousUsername);

    const historyAfter = await prisma.companyUsernameHistory.findMany({
      where: {
        companyId: company.id,
      },
    });

    expect(historyAfter).toHaveLength(historyBefore.length);
    expect(historyAfter).toEqual(historyBefore);
  });

  it("recovers the most recent username history", async () => {
    const owner = await createTestUser(prisma);

    const currentUsername = `current-${crypto.randomUUID().slice(0, 8)}`;
    const previousUsername = `previous-${crypto.randomUUID().slice(0, 8)}`;

    const company = await service.create(owner.id, {
      name: "Latest Recovery History Company",
      username: currentUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const olderReleasedAt = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

    const newerReleasedAt = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

    await prisma.companyUsernameHistory.createMany({
      data: [
        {
          companyId: company.id,
          username: previousUsername,
          releasedAt: olderReleasedAt,
          cooldownUntil: new Date(
            olderReleasedAt.getTime() +
              USERNAME_HISTORY_COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
          ),
        },
        {
          companyId: company.id,
          username: previousUsername,
          releasedAt: newerReleasedAt,
          cooldownUntil: new Date(
            newerReleasedAt.getTime() +
              USERNAME_HISTORY_COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
          ),
        },
      ],
    });

    const result = await service.recoverUsername(company.id, previousUsername);

    expect(result.username).toBe(previousUsername);

    const histories = await prisma.companyUsernameHistory.findMany({
      where: {
        companyId: company.id,
        username: previousUsername,
      },
      orderBy: {
        releasedAt: "desc",
      },
    });

    expect(histories).toHaveLength(2);
    expect(histories[0]?.releasedAt).toEqual(newerReleasedAt);
  });

  it("rejects recovery when the username history has been claimed", async () => {
    const owner = await createTestUser(prisma);
    const claimant = await createTestUser(prisma);

    const currentUsername = `current-${crypto.randomUUID().slice(0, 8)}`;
    const previousUsername = `previous-${crypto.randomUUID().slice(0, 8)}`;

    const company = await service.create(owner.id, {
      name: "Claimed History Company",
      username: currentUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const claimantCompany = await service.create(claimant.id, {
      name: "Claimant Company",
      username: `claimant-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    await prisma.companyUsernameHistory.create({
      data: {
        companyId: company.id,
        username: previousUsername,
        releasedAt: new Date(),
        cooldownUntil: new Date(
          Date.now() + USERNAME_HISTORY_COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
        ),
        claimedByCompanyId: claimantCompany.id,
        claimedAt: new Date(),
      },
    });

    await expect(
      service.recoverUsername(company.id, previousUsername),
    ).rejects.toMatchObject({
      response: {
        error: {
          code: ErrorCode.COMPANY_USERNAME_HISTORY_NOT_RECOVERABLE,
          message: "Username history cannot be recovered.",
        },
      },
      status: HttpStatus.CONFLICT,
    });

    const persistedCompany = await prisma.company.findUniqueOrThrow({
      where: {
        id: company.id,
      },
    });

    expect(persistedCompany.username).toBe(currentUsername);
  });

  it("rejects recovery by a different company", async () => {
    const ownerA = await createTestUser(prisma);
    const ownerB = await createTestUser(prisma);

    const companyA = await service.create(ownerA.id, {
      name: "Original History Company",
      username: `company-a-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const companyB = await service.create(ownerB.id, {
      name: "Different Company",
      username: `company-b-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const previousUsername = `previous-${crypto.randomUUID().slice(0, 8)}`;

    await prisma.companyUsernameHistory.create({
      data: {
        companyId: companyA.id,
        username: previousUsername,
        releasedAt: new Date(),
        cooldownUntil: new Date(
          Date.now() + USERNAME_HISTORY_COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
        ),
      },
    });

    await expect(
      service.recoverUsername(companyB.id, previousUsername),
    ).rejects.toMatchObject({
      response: {
        error: {
          code: ErrorCode.COMPANY_USERNAME_HISTORY_NOT_RECOVERABLE,
          message: "Username history cannot be recovered.",
        },
      },
      status: HttpStatus.CONFLICT,
    });

    const persistedCompanyA = await prisma.company.findUniqueOrThrow({
      where: {
        id: companyA.id,
      },
    });

    const persistedCompanyB = await prisma.company.findUniqueOrThrow({
      where: {
        id: companyB.id,
      },
    });

    expect(persistedCompanyA.username).not.toBe(previousUsername);
    expect(persistedCompanyB.username).not.toBe(previousUsername);
  });

  it("rejects recovery when the username history does not exist", async () => {
    const owner = await createTestUser(prisma);

    const currentUsername = `current-${crypto.randomUUID().slice(0, 8)}`;

    const company = await service.create(owner.id, {
      name: "Missing History Company",
      username: currentUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const missingUsername = `missing-${crypto.randomUUID().slice(0, 8)}`;

    await expect(
      service.recoverUsername(company.id, missingUsername),
    ).rejects.toMatchObject({
      response: {
        error: {
          code: ErrorCode.COMPANY_USERNAME_HISTORY_NOT_RECOVERABLE,
          message: "Username history cannot be recovered.",
        },
      },
      status: HttpStatus.CONFLICT,
    });

    const persistedCompany = await prisma.company.findUniqueOrThrow({
      where: {
        id: company.id,
      },
    });

    expect(persistedCompany.username).toBe(currentUsername);
  });

  it("claims an available historical username for another company", async () => {
    const originalOwner = await createTestUser(prisma);
    const claimantOwner = await createTestUser(prisma);

    const historicalUsername = `claimed-${crypto.randomUUID().slice(0, 8)}`;
    const originalUsername = `original-${crypto.randomUUID().slice(0, 8)}`;
    const claimantUsername = `claimant-${crypto.randomUUID().slice(0, 8)}`;

    const originalCompany = await service.create(originalOwner.id, {
      name: "Original Company",
      username: originalUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const claimantCompany = await service.create(claimantOwner.id, {
      name: "Claimant Company",
      username: claimantUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const releasedAt = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);

    const cooldownUntil = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

    const history = await prisma.companyUsernameHistory.create({
      data: {
        companyId: originalCompany.id,
        username: historicalUsername,
        releasedAt,
        cooldownUntil,
      },
    });

    const result = await service.claimUsername(
      claimantCompany.id,
      historicalUsername,
    );

    expect(result.username).toBe(historicalUsername);

    const updatedCompany = await prisma.company.findUnique({
      where: {
        id: claimantCompany.id,
      },
    });

    expect(updatedCompany?.username).toBe(historicalUsername);

    const updatedHistory = await prisma.companyUsernameHistory.findUnique({
      where: {
        id: history.id,
      },
    });

    expect(updatedHistory?.claimedByCompanyId).toBe(claimantCompany.id);
    expect(updatedHistory?.claimedAt).not.toBeNull();

    await expect(
      service.recoverUsername(originalCompany.id, historicalUsername),
    ).rejects.toMatchObject({
      response: {
        error: {
          code: ErrorCode.COMPANY_USERNAME_HISTORY_NOT_RECOVERABLE,
        },
      },
      status: HttpStatus.CONFLICT,
    });

    const unchangedOriginalCompany = await prisma.company.findUnique({
      where: {
        id: originalCompany.id,
      },
    });

    expect(unchangedOriginalCompany?.username).toBe(originalUsername);
  });

  it("rejects claiming a historical username that is still in cooldown", async () => {
    const originalOwner = await createTestUser(prisma);
    const claimantOwner = await createTestUser(prisma);

    const historicalUsername = `cooldown-claim-${crypto.randomUUID().slice(0, 8)}`;
    const originalUsername = `original-${crypto.randomUUID().slice(0, 8)}`;
    const claimantUsername = `claimant-${crypto.randomUUID().slice(0, 8)}`;

    const originalCompany = await service.create(originalOwner.id, {
      name: "Original Company",
      username: originalUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    const claimantCompany = await service.create(claimantOwner.id, {
      name: "Claimant Company",
      username: claimantUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    await prisma.companyUsernameHistory.create({
      data: {
        companyId: originalCompany.id,
        username: historicalUsername,
        releasedAt: new Date(),
        cooldownUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await expect(
      service.claimUsername(claimantCompany.id, historicalUsername),
    ).rejects.toMatchObject({
      response: {
        error: {
          code: ErrorCode.COMPANY_USERNAME_CLAIM_NOT_ALLOWED,
        },
      },
    });

    const unchangedCompany = await prisma.company.findUnique({
      where: {
        id: claimantCompany.id,
      },
    });

    expect(unchangedCompany?.username).toBe(claimantUsername);
  });

  it("rejects claiming a username without an available historical record", async () => {
    const owner = await createTestUser(prisma);

    const companyUsername = `company-${crypto.randomUUID().slice(0, 8)}`;
    const unavailableUsername = `missing-${crypto.randomUUID().slice(0, 8)}`;

    const company = await service.create(owner.id, {
      name: "Claiming Company",
      username: companyUsername,
      personType: CompanyPersonType.LEGAL_ENTITY,
    });

    await expect(
      service.claimUsername(company.id, unavailableUsername),
    ).rejects.toMatchObject({
      response: {
        error: {
          code: ErrorCode.COMPANY_USERNAME_CLAIM_NOT_ALLOWED,
        },
      },
    });

    const unchangedCompany = await prisma.company.findUnique({
      where: {
        id: company.id,
      },
    });

    expect(unchangedCompany?.username).toBe(companyUsername);
  });
});
