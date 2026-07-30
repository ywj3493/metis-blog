import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getNotionPage, getNotionPosts, getSlugMap } from "@/entities/post/api";
import { isNotionPageId } from "@/entities/post/utils";
import PostDetailPage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from "./page";

vi.mock("@/entities/post/api", () => ({
  getNotionPage: vi.fn(),
  getNotionPosts: vi.fn(),
  getSlugMap: vi.fn(),
}));
vi.mock("@/entities/post/utils", () => ({
  isNotionPageId: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));
vi.mock("@/features/post/ui", () => ({
  ClientNotionRenderer: () => <div>renderer</div>,
  PostNavigator: ({ id }: { id: string }) => <div>navigator-{id}</div>,
}));

const mockedGetPage = vi.mocked(getNotionPage);
const mockedGetPosts = vi.mocked(getNotionPosts);
const mockedGetSlugMap = vi.mocked(getSlugMap);
const mockedIsNotionPageId = vi.mocked(isNotionPageId);
const mockedNotFound = vi.mocked(notFound);

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
  });

  it("exposes dynamicParams as true (on-demand ISR)", () => {
    expect(dynamicParams).toBe(true);
  });

  describe("generateStaticParams", () => {
    it("returns an empty list so pages are generated on demand", async () => {
      // Intentionally does not pre-render any post at build time.
      await expect(generateStaticParams()).resolves.toEqual([]);
      expect(mockedGetPosts).not.toHaveBeenCalled();
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

    it("calls notFound() when the slug is not in the map", async () => {
      mockedIsNotionPageId.mockReturnValueOnce(false);
      mockedGetSlugMap.mockResolvedValueOnce({ other: "id" } as never);

      await expect(
        PostDetailPage({ params: { slug: "missing" } }),
      ).rejects.toThrow("NEXT_NOT_FOUND");
      expect(mockedNotFound).toHaveBeenCalledTimes(1);
    });
  });
});
