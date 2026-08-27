import { PasswordService } from "./password.service.js";

describe("PasswordService", () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  it("should hash a password", async () => {
    const password = "StrongPassword123!";

    const hash = await service.hash(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });

  it("should verify a correct password", async () => {
    const password = "StrongPassword123!";

    const hash = await service.hash(password);

    const result = await service.verify(password, hash);

    expect(result).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const password = "StrongPassword123!";
    const wrongPassword = "WrongPassword123!";

    const hash = await service.hash(password);

    const result = await service.verify(wrongPassword, hash);

    expect(result).toBe(false);
  });
});
