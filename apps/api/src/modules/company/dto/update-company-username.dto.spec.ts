import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { UpdateCompanyUsernameDto } from "./update-company-username.dto.js";

describe("UpdateCompanyUsernameDto", () => {
  it("accepts a username", async () => {
    const dto = plainToInstance(UpdateCompanyUsernameDto, {
      username: "bairu",
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects a missing username", async () => {
    const dto = plainToInstance(UpdateCompanyUsernameDto, {});

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0]?.property).toBe("username");
  });

  it("rejects a non-string username", async () => {
    const dto = plainToInstance(UpdateCompanyUsernameDto, {
      username: 123,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0]?.property).toBe("username");
  });
});
