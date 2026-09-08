import { validateUsername } from "./username.validator.js";

describe("validateUsername", () => {
  it("accepts a valid username", () => {
    expect(validateUsername("bairu")).toBe(true);
  });

  it("accepts letters, numbers, underscores and hyphens", () => {
    expect(validateUsername("bairu_123-test")).toBe(true);
  });

  it("accepts the minimum length", () => {
    expect(validateUsername("abc")).toBe(true);
  });

  it("accepts the maximum length", () => {
    expect(validateUsername("a".repeat(30))).toBe(true);
  });

  it("rejects usernames shorter than 3 characters", () => {
    expect(validateUsername("ab")).toBe(false);
  });

  it("rejects usernames longer than 30 characters", () => {
    expect(validateUsername("a".repeat(31))).toBe(false);
  });

  it("rejects uppercase characters", () => {
    expect(validateUsername("Bairu")).toBe(false);
  });

  it("rejects spaces", () => {
    expect(validateUsername("bairu test")).toBe(false);
  });

  it("rejects accented characters", () => {
    expect(validateUsername("bairú")).toBe(false);
  });

  it("rejects cedilla", () => {
    expect(validateUsername("baçiru")).toBe(false);
  });

  it("rejects characters outside the allowed set", () => {
    expect(validateUsername("bairu.test")).toBe(false);
  });

  it("rejects usernames starting with underscore", () => {
    expect(validateUsername("_bairu")).toBe(false);
  });

  it("rejects usernames starting with hyphen", () => {
    expect(validateUsername("-bairu")).toBe(false);
  });

  it("rejects usernames ending with underscore", () => {
    expect(validateUsername("bairu_")).toBe(false);
  });

  it("rejects usernames ending with hyphen", () => {
    expect(validateUsername("bairu-")).toBe(false);
  });
});
