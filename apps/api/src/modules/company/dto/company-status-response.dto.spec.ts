import { plainToInstance } from "class-transformer";

import { CompanyStatusResponseDto } from "./company-status-response.dto.js";
import { CompanyPersonType } from "../enums/company-person-type.enum.js";
import { CompanyStatus } from "../enums/company-status.enum.js";

describe("CompanyStatusResponseDto", () => {
  const rawCompany = {
    id: "5f8d0d55-1c3e-4f9b-8a1a-000000000001",
    ownerUserId: "5f8d0d55-1c3e-4f9b-8a1a-000000000002",
    username: "padariadarua",
    personType: CompanyPersonType.LEGAL_ENTITY,
    name: "Padaria da Rua",
    description: "Uma padaria tradicional.",
    document: "12345678000199",
    phone: "15999999999",
    email: "contato@padariadarua.com",
    profileMediaId: null,
    coverMediaId: null,
    status: CompanyStatus.ARCHIVED,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };

  it("exposes only id and status", () => {
    const dto = plainToInstance(CompanyStatusResponseDto, rawCompany, {
      excludeExtraneousValues: true,
    });

    expect(Object.keys(dto).sort()).toEqual(["id", "status"]);
  });

  it("does not expose ownerUserId or document", () => {
    const dto = plainToInstance(CompanyStatusResponseDto, rawCompany, {
      excludeExtraneousValues: true,
    });

    expect(dto).not.toHaveProperty("ownerUserId");
    expect(dto).not.toHaveProperty("document");
  });

  it("reflects the given id and status values", () => {
    const dto = plainToInstance(CompanyStatusResponseDto, rawCompany, {
      excludeExtraneousValues: true,
    });

    expect(dto.id).toBe(rawCompany.id);
    expect(dto.status).toBe(CompanyStatus.ARCHIVED);
  });
});
