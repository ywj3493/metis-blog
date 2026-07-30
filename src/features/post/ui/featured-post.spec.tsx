import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getNotionPosts } from "@/entities/post/api";
import type { IPost } from "@/entities/post/model/type";
// Import through the barrel to cover src/features/post/ui/index.ts
import { FeaturedPosts } from "@/features/post/ui";

// client-notion-renderer (re-exported by the ui barrel) imports prismjs/react-notion-x,
// which fail under vitest's ESM interop; stub it so the barrel loads.
vi.mock("./client-notion-renderer", () => ({
  ClientNotionRenderer: () => null,
}));

vi.mock("@/entities/post/api", () => ({
  getNotionPosts: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ theme: "light", setTheme: vi.fn(), themes: [] })),
}));

const post: IPost = {
  id: "a",
  title: "Featured Title",
  slugifiedTitle: "featured-title",
  tags: [{ id: "t1", name: "react", color: "blue" }],
  cover: "/cover.png",
  icon: "/mascot.png",
  publishTime: "2024-01-01",
  lastEditedTime: "2024-01-02",
  aiSummary: "",
};

describe("FeaturedPosts", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders a grid of featured posts", async () => {
    vi.mocked(getNotionPosts).mockResolvedValue([post] as never);

    render(await FeaturedPosts());

    expect(getNotionPosts).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Featured Title")).toBeInTheDocument();
  });
});
