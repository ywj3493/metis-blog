import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getNotionPosts } from "@/entities/post/api";
import { MOCK_POSTS } from "@/shared/api/notion-mock";
import { GET } from "./route";

vi.mock("@/entities/post/api", () => ({
  getNotionPosts: vi.fn(),
}));

const mockedGetNotionPosts = vi.mocked(getNotionPosts);

describe("GET /api/sitemap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("BLOG_URL", "https://blog.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns XML sitemap with base and post urls", async () => {
    mockedGetNotionPosts.mockResolvedValueOnce(MOCK_POSTS as never);

    const res = await GET();

    expect(res.headers.get("Content-Type")).toBe("application/xml");
    const xml = await res.text();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<loc>https://blog.test</loc>");
    expect(xml).toContain("<loc>https://blog.test/about</loc>");
    expect(xml).toContain("<loc>https://blog.test/posts</loc>");
    expect(xml).toContain("<loc>https://blog.test/guestbooks</loc>");
    expect(xml).toContain("<loc>https://blog.test/posts/ci-mock-post</loc>");
  });

  it("falls back to an empty base url when BLOG_URL is unset", async () => {
    vi.stubEnv("BLOG_URL", "");
    mockedGetNotionPosts.mockResolvedValueOnce(MOCK_POSTS as never);

    const res = await GET();

    const xml = await res.text();
    expect(xml).toContain("<loc>/about</loc>");
    expect(xml).toContain("<loc>/posts/ci-mock-post</loc>");
  });
});
