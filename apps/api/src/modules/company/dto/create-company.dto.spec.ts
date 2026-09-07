import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import crypto from "node:crypto";

import { CreateCompanyDto } from "./create-company.dto.js";
import { CompanyPersonType } from "../enums/company-person-type.enum.js";

describe("CreateCompanyDto", () => {
  it("rejects missing required fields", async () => {
    const dto = plainToInstance(CreateCompanyDto, {});

    const errors = await validate(dto);
    const invalidProperties = errors.map((error) => error.property);

    expect(invalidProperties).toEqual(
      expect.arrayContaining(["name", "username", "personType"]),
    );
  });

  it("accepts valid optional fields", async () => {
    const dto = plainToInstance(CreateCompanyDto, {
      name: "Padaria da Rua",
      username: "padariadarua",
      personType: CompanyPersonType.LEGAL_ENTITY,
      description: "Uma padaria tradicional da região.",
      document: "12345678000199",
      phone: "15999999999",
      email: "contato@padariadarua.com",
      profileMediaId: crypto.randomUUID(),
      coverMediaId: crypto.randomUUID(),
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects an invalid email", async () => {
    const dto = plainToInstance(CreateCompanyDto, {
      name: "Padaria da Rua",
      username: "padariadarua",
      personType: CompanyPersonType.LEGAL_ENTITY,
      email: "not-an-email",
    });

    const errors = await validate(dto);
    const emailError = errors.find((error) => error.property === "email");

    expect(emailError).toBeDefined();
    expect(emailError?.constraints).toHaveProperty("isEmail");
  });
});
