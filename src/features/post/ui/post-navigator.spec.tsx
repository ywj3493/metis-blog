import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getNotionPosts } from "@/entities/post/api";
import type { IPost } from "@/entities/post/model/type";
// Import through the barrel to cover src/features/post/ui/index.ts
import { PostNavigator } from "@/features/post/ui";
import { TooltipProvider } from "@/shared/ui/tooltip";

// The source renders radix Tooltip which requires a provider from an ancestor
// (present globally in the real app); supply one for isolated rendering.
async function renderNav(id: string) {
  render(<TooltipProvider>{await PostNavigator({ id })}</TooltipProvider>);
}

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

const tag1 = { id: "tag1", name: "React", color: "blue" };
const tag2 = { id: "tag2", name: "Vue", color: "green" };

function makePost(
  id: string,
  tags: (typeof tag1)[],
  publishTime: string,
): IPost {
  return {
    id,
    title: `Post ${id}`,
    slugifiedTitle: `post-${id}`,
    tags,
    cover: "cover.png",
    icon: "/mascot.png",
    publishTime,
    lastEditedTime: "2024-01-20",
    aiSummary: "",
  };
}

// Several tag1 posts (so related lists have >1 item and the sort comparators run)
// and one lone tag2 post (so it has no related posts).
const posts = [
  makePost("a", [tag1], "2024-01-10"),
  makePost("b", [tag1], "2024-01-05"),
  makePost("c", [tag2], "2024-01-01"),
  makePost("d", [tag1], "2024-01-08"),
  makePost("e", [tag1], "2024-01-20"),
];

describe("PostNavigator", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("throws when the current post is not found", async () => {
    vi.mocked(getNotionPosts).mockResolvedValue(posts as never);

    await expect(PostNavigator({ id: "missing" })).rejects.toThrow(
      "포스트을 불러올 수 없었습니다.",
    );
  });

  it("shows no next post at index 0, a prev post, and related posts sharing a tag", async () => {
    vi.mocked(getNotionPosts).mockResolvedValue(posts as never);

    await renderNav("a");

    // index 0 -> no next
    expect(screen.getByText("다음 글이 없습니다.")).toBeInTheDocument();
    // prev present
    expect(screen.getByText("이전 포스트")).toBeInTheDocument();
    // related posts sharing tag1 (post b)
    expect(screen.getByText("연관 포스트")).toBeInTheDocument();
  });

  it("shows no prev post at the last index, a next post, and related posts", async () => {
    vi.mocked(getNotionPosts).mockResolvedValue(posts as never);

    // "e" is the last element in the array
    await renderNav("e");

    // last index -> no prev
    expect(screen.getByText("이전 글이 없습니다.")).toBeInTheDocument();
    // next present
    expect(screen.getByText("다음 포스트")).toBeInTheDocument();
    // shares tag1 with several posts
    expect(screen.getByText("연관 포스트")).toBeInTheDocument();
  });

  it("shows both next and prev posts and no related posts for a lone-tag post", async () => {
    vi.mocked(getNotionPosts).mockResolvedValue(posts as never);

    // "c" (tag2) is a middle element with no other posts sharing its tag
    await renderNav("c");

    expect(screen.getByText("다음 포스트")).toBeInTheDocument();
    expect(screen.getByText("이전 포스트")).toBeInTheDocument();
    expect(screen.getByText("연관 포스트가 없습니다.")).toBeInTheDocument();
  });
});
