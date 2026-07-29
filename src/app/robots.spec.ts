import { afterEach, describe, expect, it, vi } from "vitest";

describe("robots", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("uses BLOG_URL when set", async () => {
    vi.resetModules();
    vi.stubEnv("BLOG_URL", "https://example.com");
    const { default: robots } = await import("./robots");

    const result = robots();

    expect(result.sitemap).toBe("https://example.com/sitemap.xml");
    expect(result.rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    });
  });

  it("falls back to empty base url when BLOG_URL unset", async () => {
    vi.resetModules();
    vi.stubEnv("BLOG_URL", "");
    const { default: robots } = await import("./robots");

    const result = robots();

    expect(result.sitemap).toBe("/sitemap.xml");
  });
});
