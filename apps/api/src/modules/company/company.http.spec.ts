import { INestApplication } from "@nestjs/common";
import request from "supertest";
import crypto from "node:crypto";

import { PrismaService } from "../../database/prisma.service.js";
import { createTestApp } from "../../test/test-app.js";
import { createTestUser } from "../../test/factories/user.factory.js";
import { CompanyPersonType } from "./enums/company-person-type.enum.js";
import { cleanDatabase } from "../../test/database/clean-database.js";
import { CompanyStatus } from "./enums/company-status.enum.js";
import { UserStatus } from "../user/enums/user-status.enum.js";
import { UserRole } from "../user/enums/user-role.enum.js";

async function createCompanyWithStatus(
  prisma: PrismaService,
  ownerUserId: string,
  status: CompanyStatus,
) {
  return prisma.company.create({
    data: {
      ownerUserId,
      name: "Padaria da Rua",
      username: `padariadarua-${crypto.randomUUID().slice(0, 8)}`,
      personType: CompanyPersonType.LEGAL_ENTITY,
      status,
    },
  });
}

async function makeAdmin(prisma: PrismaService, userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { role: UserRole.ADMIN, status: UserStatus.ACTIVE },
  });
}

describe("Company HTTP API", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("PATCH /companies/:id", () => {
    const forbiddenFieldCases: Array<{ field: string; value: unknown }> = [
      { field: "username", value: "new-username" },
      { field: "personType", value: "INDIVIDUAL" },
      { field: "document", value: "12345678000199" },
      { field: "status", value: "ARCHIVED" },
      { field: "ownerUserId", value: "5f8d0d55-1c3e-4f9b-8a1a-000000000099" },
    ];

    it.each(forbiddenFieldCases)(
      "rejects the forbidden field $field",
      async ({ field, value }) => {
        const owner = await createTestUser(prisma);

        process.env.DEV_USER_ID = owner.id;

        const company = await prisma.company.create({
          data: {
            ownerUserId: owner.id,
            name: "Padaria da Rua",
            username: `padariadarua-${crypto.randomUUID().slice(0, 8)}`,
            personType: CompanyPersonType.LEGAL_ENTITY,
          },
        });

        const response = await request(app.getHttpServer())
          .patch(`/api/v1/companies/${company.id}`)
          .send({
            name: "Padaria Atualizada",
            [field]: value,
          })
          .expect(400);

        expect(response.body.error.code).toBe("BAD_REQUEST");
      },
    );

    it("returns 200 and applies a valid update", async () => {
      const owner = await createTestUser(prisma);
      const company = await createCompanyWithStatus(
        prisma,
        owner.id,
        CompanyStatus.ACTIVE,
      );

      process.env.DEV_USER_ID = owner.id;

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/companies/${company.id}`)
        .send({ name: "Padaria Atualizada" })
        .expect(200);

      expect(response.body.name).toBe("Padaria Atualizada");
    });

    it("returns 400 for an invalid uuid", async () => {
      const owner = await createTestUser(prisma);
      process.env.DEV_USER_ID = owner.id;

      const response = await request(app.getHttpServer())
        .patch("/api/v1/companies/not-a-uuid")
        .send({ name: "Padaria Atualizada" })
        .expect(400);

      expect(response.body.error.code).toBe("BAD_REQUEST");
    });

    it("returns 400 for an invalid body", async () => {
      const owner = await createTestUser(prisma);
      const company = await createCompanyWithStatus(
        prisma,
        owner.id,
        CompanyStatus.ACTIVE,
      );

      process.env.DEV_USER_ID = owner.id;

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/companies/${company.id}`)
        .send({ name: "a" }) // viola @Length(2, 150)
        .expect(400);

      expect(response.body.error.code).toBe("BAD_REQUEST");
    });
  });

  describe("GET /companies/:id", () => {
    it("returns 200 with the company for a valid id", async () => {
      const owner = await createTestUser(prisma);
      const company = await createCompanyWithStatus(
        prisma,
        owner.id,
        CompanyStatus.ACTIVE,
      );

      const response = await request(app.getHttpServer())
        .get(`/api/v1/companies/${company.id}`)
        .expect(200);

      expect(response.body.id).toBe(company.id);
      expect(response.body.username).toBe(company.username);
      expect(response.body).not.toHaveProperty("ownerUserId");
      expect(response.body).not.toHaveProperty("document");
    });

    it.each([
      CompanyStatus.INACTIVE,
      CompanyStatus.SUSPENDED,
      CompanyStatus.ARCHIVED,
    ])("returns 404 when the company is %s", async (status) => {
      const owner = await createTestUser(prisma);
      const company = await createCompanyWithStatus(prisma, owner.id, status);

      const response = await request(app.getHttpServer())
        .get(`/api/v1/companies/${company.id}`)
        .expect(404);

      expect(response.body).toEqual({
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company not found.",
        },
      });
    });

    it("returns 400 for an invalid uuid", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/companies/not-a-uuid")
        .expect(400);

      expect(response.body.error.code).toBe("BAD_REQUEST");
    });

    it("returns 404 when the company does not exist", async () => {
      const nonExistentId = crypto.randomUUID();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/companies/${nonExistentId}`)
        .expect(404);

      expect(response.body.error.code).toBe("COMPANY_NOT_FOUND");
    });
  });

  describe("POST /companies/:id/deactivate", () => {
    it("returns 200 when the owner deactivates an active company", async () => {
      const owner = await createTestUser(prisma);
      const company = await createCompanyWithStatus(
        prisma,
        owner.id,
        CompanyStatus.ACTIVE,
      );

      process.env.DEV_USER_ID = owner.id;

      const response = await request(app.getHttpServer())
        .post(`/api/v1/companies/${company.id}/deactivate`)
        .expect(200);

      expect(response.body.status).toBe(CompanyStatus.INACTIVE);
    });

    it("returns 403 when the requester is not the owner", async () => {
      const owner = await createTestUser(prisma);
      const otherUser = await createTestUser(prisma);
      const company = await createCompanyWithStatus(
        prisma,
        owner.id,
        CompanyStatus.ACTIVE,
      );

      process.env.DEV_USER_ID = otherUser.id;

      const response = await request(app.getHttpServer())
        .post(`/api/v1/companies/${company.id}/deactivate`)
        .expect(403);

      expect(response.body.error.code).toBe("FORBIDDEN");
    });
  });

  describe("POST /companies/:id/reactivate", () => {
    it("returns 200 when the owner reactivates an inactive company", async () => {
      const owner = await createTestUser(prisma);
      const company = await createCompanyWithStatus(
        prisma,
        owner.id,
        CompanyStatus.INACTIVE,
      );

      process.env.DEV_USER_ID = owner.id;

      const response = await request(app.getHttpServer())
        .post(`/api/v1/companies/${company.id}/reactivate`)
        .expect(200);

      expect(response.body.status).toBe(CompanyStatus.ACTIVE);
    });
  });

  describe("POST /companies/:id/archive", () => {
    it.each([CompanyStatus.ACTIVE, CompanyStatus.INACTIVE])(
      "returns 200 when the owner archives a company with status %s",
      async (initialStatus) => {
        const owner = await createTestUser(prisma);
        const company = await createCompanyWithStatus(
          prisma,
          owner.id,
          initialStatus,
        );

        process.env.DEV_USER_ID = owner.id;

        const response = await request(app.getHttpServer())
          .post(`/api/v1/companies/${company.id}/archive`)
          .expect(200);

        expect(response.body.status).toBe(CompanyStatus.ARCHIVED);
      },
    );
  });

  describe("POST /admin/companies/:id/suspend", () => {
    it.each([CompanyStatus.ACTIVE, CompanyStatus.INACTIVE])(
      "returns 200 when an admin suspends a company with status %s",
      async (initialStatus) => {
        const admin = await createTestUser(prisma);
        await makeAdmin(prisma, admin.id);

        const owner = await createTestUser(prisma);
        const company = await createCompanyWithStatus(
          prisma,
          owner.id,
          initialStatus,
        );

        process.env.DEV_USER_ID = admin.id;

        const response = await request(app.getHttpServer())
          .post(`/api/v1/admin/companies/${company.id}/suspend`)
          .expect(200);

        expect(response.body.status).toBe(CompanyStatus.SUSPENDED);
      },
    );

    it("returns 403 when the requester is not an admin", async () => {
      const owner = await createTestUser(prisma);
      const company = await createCompanyWithStatus(
        prisma,
        owner.id,
        CompanyStatus.ACTIVE,
      );

      process.env.DEV_USER_ID = owner.id;

      const response = await request(app.getHttpServer())
        .post(`/api/v1/admin/companies/${company.id}/suspend`)
        .expect(403);

      expect(response.body.error.code).toBe("FORBIDDEN");
    });
  });

  describe("POST /admin/companies/:id/restore", () => {
    it.each([CompanyStatus.SUSPENDED, CompanyStatus.ARCHIVED])(
      "returns 200 when an admin restores a company with status %s",
      async (initialStatus) => {
        const admin = await createTestUser(prisma);
        await makeAdmin(prisma, admin.id);

        const owner = await createTestUser(prisma);
        const company = await createCompanyWithStatus(
          prisma,
          owner.id,
          initialStatus,
        );

        process.env.DEV_USER_ID = admin.id;

        await request(app.getHttpServer())
          .post(`/api/v1/admin/companies/${company.id}/restore`)
          .expect(200);
      },
    );

    it("returns 403 when the requester is not an admin", async () => {
      const owner = await createTestUser(prisma);
      const company = await createCompanyWithStatus(
        prisma,
        owner.id,
        CompanyStatus.SUSPENDED,
      );

      process.env.DEV_USER_ID = owner.id;

      const response = await request(app.getHttpServer())
        .post(`/api/v1/admin/companies/${company.id}/restore`)
        .expect(403);

      expect(response.body.error.code).toBe("FORBIDDEN");
    });
  });
});
