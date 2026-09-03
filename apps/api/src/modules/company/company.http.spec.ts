import { INestApplication } from "@nestjs/common";
import request from "supertest";
import crypto from "node:crypto";

import { PrismaService } from "../../database/prisma.service.js";
import { createTestApp } from "../../test/test-app.js";
import { createTestUser } from "../../test/factories/user.factory.js";
import { CompanyPersonType } from "./enums/company-person-type.enum.js";
import { cleanDatabase } from "../../test/database/clean-database.js";

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
  });
});
