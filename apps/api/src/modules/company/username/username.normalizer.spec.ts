import { normalizeUsername } from "./username.normalizer.js";

describe("normalizeUsername", () => {
  it("converts username to lowercase", () => {
    expect(normalizeUsername("BAIRU")).toBe("bairu");
  });

  it("preserves valid lowercase characters", () => {
    expect(normalizeUsername("bairu_123")).toBe("bairu_123");
  });

  it("is deterministic", () => {
    const input = "Bairu_123";

    expect(normalizeUsername(input)).toBe(normalizeUsername(input));
  });

  it("does not trim whitespace", () => {
    expect(normalizeUsername(" Bairu ")).toBe(" bairu ");
  });

  it("does not transliterate accented characters", () => {
    expect(normalizeUsername("Bairú")).toBe("bairú");
  });
});
