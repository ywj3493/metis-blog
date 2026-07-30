import { describe, expect, it } from "vitest";
import { isNotionPageId } from "./index";

describe("isNotionPageId", () => {
  it("accepts a UUID with hyphens", () => {
    expect(isNotionPageId("00000000-0000-0000-0000-000000000001")).toBe(true);
  });

  it("accepts a 32-char UUID without hyphens", () => {
    expect(isNotionPageId("0123456789abcdef0123456789abcdef")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(isNotionPageId("0123456789ABCDEF0123456789ABCDEF")).toBe(true);
  });

  it("rejects a slug string", () => {
    expect(isNotionPageId("my-blog-post-title")).toBe(false);
  });

  it("rejects a malformed id", () => {
    expect(isNotionPageId("1234")).toBe(false);
  });
});
