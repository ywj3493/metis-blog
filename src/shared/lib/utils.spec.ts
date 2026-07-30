import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges multiple class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("resolves conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false, null, undefined, 0 as unknown as string, "b")).toBe(
      "a b",
    );
  });

  it("supports conditional object syntax", () => {
    expect(cn({ active: true, hidden: false })).toBe("active");
  });
});
