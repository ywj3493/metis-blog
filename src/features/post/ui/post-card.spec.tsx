import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { Post } from "@/entities/post/model";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ theme: "dark", setTheme: vi.fn() })),
  ThemeProvider: ({ children }: { children?: ReactNode }) => children,
}));

import { PostCard, PostCardSkeleton } from "./post-card";

const summarizedPost = Post.create({
  id: "p1",
  title: "Summarized Post",
  slugifiedTitle: "summarized-post",
  tags: [{ id: "t1", name: "react", color: "blue" }],
  cover: "/cover.png",
  icon: "/icon.png",
  publishTime: "2024-01-01",
  lastEditedTime: "2024-01-01",
  aiSummary: "이것은 요약입니다.",
});

const plainPost = Post.create({
  id: "p2",
  title: "Plain Post",
  slugifiedTitle: "plain-post",
  tags: [{ id: "t2", name: "next", color: "gray" }],
  cover: "/cover.png",
  icon: "",
  publishTime: "2024-01-02",
  lastEditedTime: "2024-01-02",
  aiSummary: "",
});

describe("PostCard", () => {
  it("renders the icon and the summary card when the post is summarized", () => {
    render(<PostCard post={summarizedPost} />);

    expect(screen.getByText("Summarized Post")).toBeInTheDocument();
    expect(screen.getByAltText("icon")).toBeInTheDocument();
    expect(screen.getByText("이것은 요약입니다.")).toBeInTheDocument();
  });

  it("skips the icon and renders the summary button when not summarized", () => {
    render(<PostCard post={plainPost} />);

    expect(screen.getByText("Plain Post")).toBeInTheDocument();
    expect(screen.queryByAltText("icon")).not.toBeInTheDocument();
    expect(
      screen.getByText("메티에게 요약을 요청해보세요!"),
    ).toBeInTheDocument();
  });
});

describe("PostCardSkeleton", () => {
  it("renders the skeleton placeholder", () => {
    const { container } = render(<PostCardSkeleton />);

    expect(container.querySelector(".skeleton-card")).toBeInTheDocument();
  });
});
