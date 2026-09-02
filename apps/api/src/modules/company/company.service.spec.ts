import { CompanyService } from "./company.service.js";
import { PrismaService } from "../../database/prisma.service.js";
import { createTestUser } from "../../test/factories/user.factory.js";
import { CompanyPersonType } from "./enums/company-person-type.enum.js";
import { CreateCompanyDto } from "./dto/create-company.dto.js";
import { ErrorCode } from "../../common/errors/error-codes.js";
import { HttpStatus } from "@nestjs/common";
import { cleanDatabase } from "../../test/database/clean-database.js";

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
});
