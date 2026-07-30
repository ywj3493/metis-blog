import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { Post } from "@/entities/post/model";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ theme: "dark", setTheme: vi.fn() })),
  ThemeProvider: ({ children }: { children?: ReactNode }) => children,
}));

import { SmallPostCard } from "./small-post-card";

const post = Post.create({
  id: "p1",
  title: "Hello World",
  slugifiedTitle: "hello-world",
  tags: [{ id: "t1", name: "react", color: "blue" }],
  cover: "/cover.png",
  icon: "/icon.png",
  publishTime: "2024-01-01",
  lastEditedTime: "2024-01-01",
  aiSummary: "",
});

describe("SmallPostCard", () => {
  it("renders the title, icon and tags with a link to the post", () => {
    render(<SmallPostCard post={post} />);

    expect(screen.getByText("Hello World")).toBeInTheDocument();
    expect(screen.getByAltText("icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "react" })).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/posts/hello-world",
    );
  });
});
