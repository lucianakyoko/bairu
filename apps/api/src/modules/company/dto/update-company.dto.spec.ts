import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { UpdateCompanyDto } from "./update-company.dto.js";

describe("UpdateCompanyDto", () => {
  it("rejects an empty payload", async () => {
    const dto = plainToInstance(UpdateCompanyDto, {});

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0]?.constraints).toHaveProperty("atLeastOneField");
  });

  it("accepts a payload with a single valid field", async () => {
    const dto = plainToInstance(UpdateCompanyDto, {
      name: "Padaria Renovada",
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("allows null to clear an optional field", async () => {
    const dto = plainToInstance(UpdateCompanyDto, {
      phone: null,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });
});
