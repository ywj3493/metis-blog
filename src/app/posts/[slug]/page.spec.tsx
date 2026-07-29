import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getNotionPage, getNotionPosts, getSlugMap } from "@/entities/post/api";
import { isNotionPageId } from "@/entities/post/utils";
import PostDetailPage, { generateMetadata, generateStaticParams } from "./page";

vi.mock("@/entities/post/api", () => ({
  getNotionPage: vi.fn(),
  getNotionPosts: vi.fn(),
  getSlugMap: vi.fn(),
}));
vi.mock("@/entities/post/utils", () => ({
  isNotionPageId: vi.fn(),
}));
vi.mock("@/features/post/ui", () => ({
  ClientNotionRenderer: () => <div>renderer</div>,
  // biome-ignore lint/suspicious/noExplicitAny: test stub
  PostNavigator: ({ id }: any) => <div>navigator-{id}</div>,
}));

const mockedGetPage = vi.mocked(getNotionPage);
const mockedGetPosts = vi.mocked(getNotionPosts);
const mockedGetSlugMap = vi.mocked(getSlugMap);
const mockedIsNotionPageId = vi.mocked(isNotionPageId);

// IPost-shaped fixtures (Post.create accepts IPost directly)
function makePost(overrides: Record<string, unknown> = {}) {
  return {
    id: "id-1",
    title: "My Title",
    slugifiedTitle: "my-title",
    tags: [],
    cover: "",
    icon: "",
    publishTime: "2024-01-01",
    lastEditedTime: "2024-01-01T00:00:00.000Z",
    aiSummary: "",
    ...overrides,
  };
}

describe("posts/[slug] page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("generateStaticParams", () => {
    it("returns the slug list", async () => {
      mockedGetPosts.mockResolvedValueOnce([makePost()] as never);

      const result = await generateStaticParams();

      expect(result).toEqual([{ slug: "my-title" }]);
    });
  });

  describe("generateMetadata", () => {
    it("uses aiSummary when present", async () => {
      mockedGetPosts.mockResolvedValueOnce([
        makePost({ aiSummary: "a summary" }),
      ] as never);

      const meta = await generateMetadata({ params: { slug: "my-title" } });

      expect(meta.title).toBe("My Title");
      expect(meta.description).toBe("a summary");
    });

    it("falls back to a default description when aiSummary is empty", async () => {
      mockedGetPosts.mockResolvedValueOnce([
        makePost({ aiSummary: "" }),
      ] as never);

      const meta = await generateMetadata({ params: { slug: "my-title" } });

      expect(meta.description).toBe("My Title - 블로그 포스트");
    });

    it("returns Post Not Found when no post matches", async () => {
      mockedGetPosts.mockResolvedValueOnce([makePost()] as never);

      const meta = await generateMetadata({ params: { slug: "nope" } });

      expect(meta).toEqual({ title: "Post Not Found" });
    });
  });

  describe("PostDetailPage / slugToPostId", () => {
    it("uses the slug directly when it is a notion page id", async () => {
      mockedIsNotionPageId.mockReturnValueOnce(true);
      mockedGetPage.mockResolvedValueOnce({} as never);

      render(await PostDetailPage({ params: { slug: "direct-id" } }));

      expect(mockedGetPage).toHaveBeenCalledWith("direct-id");
      expect(screen.getByText("renderer")).toBeInTheDocument();
      expect(screen.getByText("navigator-direct-id")).toBeInTheDocument();
    });

    it("resolves the id from the slug map", async () => {
      mockedIsNotionPageId.mockReturnValueOnce(false);
      mockedGetSlugMap.mockResolvedValueOnce({
        "my-slug": "mapped-id",
      } as never);
      mockedGetPage.mockResolvedValueOnce({} as never);

      render(await PostDetailPage({ params: { slug: "my-slug" } }));

      expect(mockedGetPage).toHaveBeenCalledWith("mapped-id");
      expect(screen.getByText("navigator-mapped-id")).toBeInTheDocument();
    });

    it("throws when the slug map is missing", async () => {
      mockedIsNotionPageId.mockReturnValueOnce(false);
      mockedGetSlugMap.mockResolvedValueOnce(null as never);

      await expect(
        PostDetailPage({ params: { slug: "my-slug" } }),
      ).rejects.toThrow("Slug map not found");
    });

    it("throws when the slug is not in the map", async () => {
      mockedIsNotionPageId.mockReturnValueOnce(false);
      mockedGetSlugMap.mockResolvedValueOnce({ other: "id" } as never);

      await expect(
        PostDetailPage({ params: { slug: "missing" } }),
      ).rejects.toThrow("Post not found for given slug or id.");
    });
  });
});
