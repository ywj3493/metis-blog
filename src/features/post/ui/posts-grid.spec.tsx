import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { Post } from "@/entities/post/model";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ theme: "dark", setTheme: vi.fn() })),
  ThemeProvider: ({ children }: { children?: ReactNode }) => children,
}));

import { PostsGrid } from "./posts-grid";

const makePost = (id: string, title: string) =>
  Post.create({
    id,
    title,
    slugifiedTitle: title.toLowerCase().replace(/\s+/g, "-"),
    tags: [{ id: "t1", name: "react", color: "blue" }],
    cover: "/cover.png",
    icon: "/icon.png",
    publishTime: "2024-01-01",
    lastEditedTime: "2024-01-01",
    aiSummary: "",
  });

describe("PostsGrid", () => {
  it("renders a PostCard for each post", () => {
    const posts = [makePost("p1", "First Post"), makePost("p2", "Second Post")];

    render(<PostsGrid posts={posts} />);

    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
  });
});
